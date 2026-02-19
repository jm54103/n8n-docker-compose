import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const isDev = process.env.NODE_ENV !== 'production'

console.log(`NODE_ENV ${process.env.NODE_ENV}`);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

if (!isDev) {

  app.use(express.static(path.join(__dirname, 'dist')))

}

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`)
})
