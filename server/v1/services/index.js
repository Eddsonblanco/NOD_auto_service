import express from 'express'
import { upload } from '../../middleware/multer'

import {
  create,
  all,
  remove,
  edit,
  one
} from '../../controllers/services'

const router = express.Router()

router.post('/',
  upload.fields([ { maxCount: 1, name: 'icon' },
    { maxCount: 1, name: 'image1' },
    { maxCount: 1, name: 'image2' } ]), async (req, res) => {
    try {
    // req.headers // token
      const data = await create(req)
      res.status(200).send({ data, success: true })
    } catch (err) {
      res.status(500).send({ error: err.message, success: false })
    }
  })

router.get('/', async (req, res) => {
  try {
    const data = await all(req.query)
    res.status(200).send({ data, success: true })
  } catch (err) {
    res.status(500).send({ error: err.message, success: false })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await one(id)
    res.status(200).send({ data, success: true })
  } catch (err) {
    res.status(500).send({ error: err.message, success: false })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const data = await remove(id)

    res.status(200).json({ data, success: true })
  } catch (err) {
    res.status(500).send({ error: err.message, success: false })
  }
})

router.put('/', upload.fields([ { maxCount: 1, name: 'icon' },
  { maxCount: 1, name: 'image1' },
  { maxCount: 1, name: 'image2' } ]), async (req, res) => {
  try {
    // const { id } = req.params

    const data = await edit(req)
    res.status(200).json({ data, success: true })
  } catch (err) {
    res.status(500).json({ error: err.message, success: false })
  }
})

export default router
