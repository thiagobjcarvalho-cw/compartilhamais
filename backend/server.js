const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(express.json())

// Minimal CORS middleware for frontend access when running in containers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
  } else {
    next()
  }
})

const dataPath = path.join(__dirname, 'db.json')
let data = {}
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
} catch (e) {
  console.error('Erro ao ler db.json:', e)
  data = { institutions: [], donations: [], donors: [] }
}
console.log('Backend mock: loaded institutions count =', data.institutions?.length ?? 0)
console.log('Backend mock: data preview =', JSON.stringify(data.institutions ?? [], null, 2).slice(0, 300))

app.get('/institutions', (req, res) => {
  res.json(data.institutions ?? [])
})

app.get('/donations', (req, res) => {
  res.json(data.donations ?? [])
})

app.get('/donors', (req, res) => {
  res.json(data.donors ?? [])
})

// Health check endpoint (CORS already configured globally)
app.get('/healthz', (req, res) => {
  res.json({ ok: true, status: 'UP' })
})

// Get institution by id
app.get('/institutions/:id', (req, res) => {
  const id = req.params.id
  const inst = (data.institutions ?? []).find((i) => i.id === id)
  if (inst) return res.json(inst)
  res.status(404).json({ error: 'Instituição não encontrada' })
})

// Get needs for an institution by id
app.get('/institutions/:id/needs', (req, res) => {
  const id = req.params.id
  const inst = (data.institutions ?? []).find((i) => i.id === id)
  if (inst) return res.json(inst.needs ?? [])
  res.status(404).json({ error: 'Instituição não encontrada' })
})

// Get all needs from all institutions
app.get('/needs', (req, res) => {
  const allNeeds = []
  ;(data.institutions ?? []).forEach((inst) => {
    if (inst.needs && Array.isArray(inst.needs)) {
      inst.needs.forEach((need) => {
        allNeeds.push({
          ...need,
          institutionId: inst.id,
          institutionName: inst.name,
        })
      })
    }
  })
  res.json(allNeeds)
})

// Get urgent needs only
app.get('/needs/urgent', (req, res) => {
  const urgentNeeds = []
  ;(data.institutions ?? []).forEach((inst) => {
    if (inst.needs && Array.isArray(inst.needs)) {
      inst.needs
        .filter((need) => need.urgency === 'CRITICAL' || need.urgency === 'HIGH')
        .forEach((need) => {
          urgentNeeds.push({
            ...need,
            institutionId: inst.id,
            institutionName: inst.name,
          })
        })
    }
  })
  res.json(urgentNeeds)
})

// Get donation by id (optional, use for completeness)
app.get('/donations/:id', (req, res) => {
  const id = req.params.id
  const d = (data.donations ?? []).find((n) => n.id === id)
  if (d) return res.json(d)
  res.status(404).json({ error: 'Doação não encontrada' })
})

const port = process.env.PORT || 3001
 

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend mock listening on port ${port}`)
  })
}
module.exports = app
