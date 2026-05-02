import { createClient } from 'redis'

let client

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL })
    await client.connect()
  }
  return client
}

export default async function handler(req, res) {
  const redis = await getClient()
  const count = await redis.incr('visitor-count')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({ count })
}
