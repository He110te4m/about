import express, { Router } from 'express'
import serverless from 'serverless-http'

const api = express()

const router = Router()
router.get('/tts', async (req, res) => {
  res.end(`Hello tts ${process.env.HUGGINGFACE_API_KEY}`)
})

api.use('/api/', router)

export const handler = serverless(api)
