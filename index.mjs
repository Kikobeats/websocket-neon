import { neonConfig, Pool } from '@neondatabase/serverless'
import { WebSocket } from 'undici'

neonConfig.webSocketConstructor = WebSocket

if (!process.env.DATABASE_URL) {
  throw new Error('process.env.DATABASE_URL should be set.')
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const longitude = parseFloat('-122.47')
const latitude = parseFloat('37.81')

const { rows: sites } = await pool.query(
  `
  SELECT 
    id_no, name_en, category,
    'https://whc.unesco.org/en/list/' || id_no || '/' AS link,
    location <-> st_makepoint($1, $2) AS distance
  FROM whc_sites_2021
  ORDER BY distance
  LIMIT 10`,
  [longitude, latitude]
)

await pool.end()

console.log(JSON.stringify({ longitude, latitude, sites }, null, 2))
