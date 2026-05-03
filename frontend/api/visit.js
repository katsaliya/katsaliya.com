import { createClient } from 'redis'

let client

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.ksport_REDIS_URL || process.env.KSPORT_REDIS_URL })
    await client.connect()
  }
  return client
}

export default async function handler(req, res) {
  const keys = Object.keys(process.env).filter(k => k.toLowerCase().includes('redis'))
  console.log('redis env keys:', keys)
  const redis = await getClient()
  const count = await redis.incr('visitor-count')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({ count })
}
