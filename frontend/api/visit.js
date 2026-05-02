import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  const count = await kv.incr('visitor-count')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({ count })
}
