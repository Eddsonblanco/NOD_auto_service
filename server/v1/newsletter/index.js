import express from 'express'

import {
  create,
  all,
  remove,
  edit,
  one
} from '../../controllers/newsletters'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    // req.headers // token
    const data = await create(req)
    if(data === 'Email is Register')
      throw 'Email is Register'

    res.status(200).send({ data, success: true })
  } catch (err) {
    res.status(500).send({ error: err, success: false })
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

router.put('/', async (req, res) => {
  try {
    // const { id } = req.params

    const data = await edit(req)
    res.status(200).json({ data, success: true })
  } catch (err) {
    res.status(500).json({ error: err.message, success: false })
  }
})

export default router
