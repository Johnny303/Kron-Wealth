import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required (name, email, phone, message).' })
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY.' })
  }

  const { error } = await supabase
    .from('contacts')
    .insert([{ name, email, phone, message }])

  if (error) {
    console.error('Supabase insert error:', error)
    return res.status(500).json({ error: 'Failed to save your message. Please try again later.' })
  }

  res.json({ success: true, message: 'Thank you! We will be in touch soon.' })
})

export default router
