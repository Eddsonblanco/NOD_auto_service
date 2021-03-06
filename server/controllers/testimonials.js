
import { Testimonials, Datatables } from '../models'
import { Types } from 'mongoose'
import { removeImage } from '../utils'

const create = async (req) => {
  try {
    const testimonial = Testimonials(req.body)

    return await testimonial.save()
  } catch (err) {
    return err
  }
}

const allHome = async () => {
  return Testimonials.find({})
}

const all = async (query) => {
  try {
    const {
      perPage = 10,
      page = 1,
      orderBy,
      sort
    } = query

    const sortNumber = sort === 'asc' ? 1 : -1

    const columns = await Datatables.find({ source: 'testimonials' }).sort({ index: 1 })

    const [ { count: [ { total } ], data: rows } ] = await Testimonials.aggregate([
      {
        $facet: {
          count: [
            { $count: 'total' }
          ],
          data: [
            { $project: { __v: 0, createdAt: 0 } },
            { $sort: { [orderBy || 'updatedAt']: sortNumber } },
            { $skip: parseInt(page - 1) * parseInt(perPage) },
            { $limit: parseInt(perPage) }
          ]
        }
      }
    ])

    return {
      columns,
      pagination: {
        page   : parseInt(page),
        perPage: parseInt(perPage),
        total
      },
      rows
    }
  } catch (err) {
    return err
  }
}

const remove = async (id) => {
  try {
    const { image } = await Testimonials.findOne({ _id: Types.ObjectId(id) }).select('image')

    if(image)
      removeImage(image)

    const { deletedCount } = await Testimonials.deleteOne({ _id: Types.ObjectId(id) }).lean()

    return deletedCount
  } catch (err) {
    return err
  }
}

const edit = async (req) => {
  try {
    const {
      id,
      ...others
    } = req.body

    const testimonial = Testimonials(others)

    // if(req.file) {
    //   const { image } = await Testimonials.findOne({ _id: Types.ObjectId(id) }).select('image')
    //   removeImage(image)
    //   testimonial.setImgUrl(req.file.filename)
    // }

    delete testimonial._doc._id

    return await Testimonials.findOneAndUpdate({ _id: Types.ObjectId(id) },
      { $set: testimonial },
      { 'new': true, upsert: true })
  } catch (err) {
    return err
  }
}

const one = async (id) => {
  try {
    return await Testimonials.findOne({ _id: Types.ObjectId(id) })
  } catch (err) {
    return err
  }
}
export {
  create,
  all,
  allHome,
  remove,
  edit,
  one
}
