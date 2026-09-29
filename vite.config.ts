import { defineConfig, loadEnv, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'

const TILE_STYLES: Record<string, string> = {
  hybrid: 'hybrid',
  streets: 'streets-v2',
  topo: 'outdoor-v4',
}

const KEY_HINT =
  'Set MAPTILER_KEY or VITE_MAPTILER_KEY in .env (read server-side by this proxy — never shipped to the browser).'

function encodeKeyResponse(data: unknown): string {
  return `data:${JSON.stringify(data)}`
}

function json(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(encodeKeyResponse(payload))
}

function maptilerProxy(): Plugin {
  let key = ''

  const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!key) {
      json(res, 503, { error: 'MAPTILER_KEY_NOT_CONFIGURED', hint: KEY_HINT })
      return
    }

    let parsed: URL
    try {
      parsed = new URL(req.url || '/', 'http://localhost')
    } catch {
      json(res, 400, { error: 'invalid request' })
      return
    }

    const path = parsed.pathname

    if (path === '/geocode') {
      const q = parsed.searchParams.get('q')
      if (!q || !q.trim()) {
        json(res, 400, { error: 'missing q' })
        return
      }
      const upstream = `https://api.maptiler.com/geocoding/${encodeURIComponent(q.trim())}.json?key=${encodeURIComponent(key)}&language=en&country=in&limit=6`
      try {
        const r = await fetch(upstream)
        const body = await r.text()
        res.statusCode = r.status
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'public, max-age=300')
        res.end(r.ok ? body : JSON.stringify({ error: body }))
      } catch {
        json(res, 502, { error: 'geocode proxy upstream error' })
      }
      return
    }

    const tile = path.match(/^\/tile\/([^/]+)\/(\d{1,2})\/(\d+)\/(\d+)$/)
    if (tile) {
      const style = TILE_STYLES[tile[1]]
      if (!style) {
        json(res, 400, { error: `unknown style '${tile[1]}'` })
        return
      }
      const [, , z, x, y] = tile
      const upstream = `https://api.maptiler.com/maps/${style}/256/${z}/${x}/${y}.jpg?key=${encodeURIComponent(key)}`
      try {
        const r = await fetch(upstream)
        if (!r.ok) {
          res.statusCode = r.status
          res.end(`MapTiler tile error ${r.status}`)
          return
        }
        const buf = Buffer.from(await r.arrayBuffer())
        res.statusCode = 200
        res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg')
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.end(buf)
      } catch {
        json(res, 502, { error: 'tile proxy upstream error' })
      }
      return
    }

    json(res, 404, { error: 'not found', ok: false })
  }

  return {
    name: 'aquasentinel-maptiler-proxy',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '')
      // Server-side only. Accept several conventional names. The value MUST be the
      // MapTiler API key itself — NOT the dashboard URL (https://cloud.maptiler.com/account/keys/<key>).
      key = env.VITE_MAPTILER_API_KEY || env.MAPTILER_KEY || env.VITE_MAPTILER_KEY || ''
      // Defensive: if a dashboard URL or otherwise unusable value slipped in,
      // fall back to the next candidate so the map never silently breaks.
      if (key.includes('/account/keys/') || key.length < 16) {
        key = env.MAPTILER_KEY || env.VITE_MAPTILER_KEY || ''
      }
    },
    configureServer(server) {
      server.middlewares.use('/api/maptiler', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/maptiler', handler)
    },
  }
}

export default defineConfig({
  plugins: [react(), maptilerProxy()],
})