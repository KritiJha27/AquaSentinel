export type Role = 'public' | 'authority' | 'scientist' | 'admin'

export interface AuthUser {
  email: string
  name: string
  role: Role
  createdAt: string
}

interface StoredUser extends AuthUser {
  salt: string
  hash: string
}

export const roleLabels: Record<Role, string> = {
  public: 'Public User',
  authority: 'Disaster Management Authority',
  scientist: 'Research Scientist',
  admin: 'Administrator',
}

export const demoAccounts = [
  { name: 'Mrinal Sen', email: 'admin@demo.aquasentinel.ai', password: 'admin@123', role: 'admin' as Role, label: 'Administrator' },
  { name: 'Dr. Kavitha Menon', email: 'scientist@demo.aquasentinel.ai', password: 'scientist@123', role: 'scientist' as Role, label: 'Research Scientist' },
  { name: 'State Disaster Cell', email: 'authority@demo.aquasentinel.ai', password: 'authority@123', role: 'authority' as Role, label: 'Disaster Authority' },
  { name: 'Rahul Sharma', email: 'public@demo.aquasentinel.ai', password: 'public@123', role: 'public' as Role, label: 'Public User' },
]

const USERS_KEY = 'aquasentinel_users'
const SESSION_KEY = 'aquasentinel_session'

const isBrowser = typeof window !== 'undefined'

export function generateSalt(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 60000, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  return Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readUsers(): StoredUser[] {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  if (!isBrowser) return
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    /* storage unavailable */
  }
}

let seeding: Promise<StoredUser[]> | null = null

export function ensureSeeded(): Promise<StoredUser[]> {
  if (seeding) return seeding
  seeding = (async () => {
    const existing = readUsers()
    if (existing.length > 0) return existing
    const seeded: StoredUser[] = []
    for (const acc of demoAccounts) {
      const salt = generateSalt()
      const hash = await hashPassword(acc.password, salt)
      seeded.push({ email: acc.email, name: acc.name, role: acc.role, createdAt: new Date().toISOString(), salt, hash })
    }
    writeUsers(seeded)
    return seeded
  })()
  return seeding
}

export async function registerUser(fullName: string, email: string, password: string): Promise<AuthUser> {
  const users = await ensureSeeded()
  const normalized = email.trim().toLowerCase()
  if (users.some((u) => u.email === normalized)) throw new Error('An account with this email already exists')
  if (password.length < 8) throw new Error('Password must be at least 8 characters')
  const salt = generateSalt()
  const hash = await hashPassword(password, salt)
  const user: StoredUser = { email: normalized, name: fullName.trim(), role: 'public', createdAt: new Date().toISOString(), salt, hash }
  writeUsers([...users, user])
  return { email: user.email, name: user.name, role: user.role, createdAt: user.createdAt }
}

export async function verifyCredentials(email: string, password: string): Promise<AuthUser | null> {
  const users = await ensureSeeded()
  const normalized = email.trim().toLowerCase()
  const stored = users.find((u) => u.email === normalized)
  if (!stored) return null
  const hash = await hashPassword(password, stored.salt)
  if (hash !== stored.hash) return null
  return { email: stored.email, name: stored.name, role: stored.role, createdAt: stored.createdAt }
}

export function saveSession(user: AuthUser, remember: boolean) {
  if (!isBrowser) return
  const store = remember ? localStorage : sessionStorage
  store.setItem(SESSION_KEY, JSON.stringify({ ...user, loginAt: new Date().toISOString() }))
}

export function loadSession(): AuthUser | null {
  if (!isBrowser) return null
  try {
    for (const store of [localStorage, sessionStorage]) {
      const raw = store.getItem(SESSION_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser
        if (parsed?.email) return parsed
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

export function clearSession() {
  if (!isBrowser) return
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function isDemoCredential(email: string) {
  const normalized = email.trim().toLowerCase()
  return demoAccounts.some((a) => a.email === normalized)
}