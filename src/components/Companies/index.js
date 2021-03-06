import React from 'react'
import { useSelector } from 'react-redux'

const Companies = () => {
  const {
    items = []
  } = useSelector(({ companies }) => companies)

  return (
    <div>
      <ul>
        {
          items.map(item => (
            <li key={item._id}>
              <img alt={item.alt_text} src={item.image} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Companies
