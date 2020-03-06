
import { companies } from '../models'
import { Types } from 'mongoose'
import { removeImage } from '../utils'

// import { escapeRegex } from '../utils/regex'

const create = async (req) => {
  try {
    const {
      alt_text
    } = req.body
    const company = companies({
      alt_text
    })

    if(req.file)
      company.setImgUrl(req.file.filename)

    return await company.save()
  } catch (err) {
    return err
  }
}

const all = async () => {
  try {
    const companiesData = await companies.find({})

    return {
      items: companiesData
    }
  } catch (err) {
    return err
  }
}

const remove = async (id) => {
  try {
    const { image } = await companies.findOne({ _id: Types.ObjectId(id) }).select('image')

    if(image)
      removeImage(image)

    const { deletedCount } = await companies.deleteOne({ _id: Types.ObjectId(id) }).lean()

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

    const company = companies(others)

    if(req.file) {
      const { image } = await companies.findOne({ _id: Types.ObjectId(id) }).select('image')
      removeImage(image)
      company.setImgUrl(req.file.filename)
    }

    delete company._doc._id

    return await companies.findOneAndUpdate({ _id: Types.ObjectId(id) },
      { $set: company },
      { 'new': true, upsert: true })
  } catch (err) {
    return err
  }
}
export {
  create,
  all,
  remove,
  edit
}