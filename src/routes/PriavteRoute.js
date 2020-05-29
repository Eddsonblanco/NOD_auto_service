import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'

function PrivateRoute({ children, ...rest }) {
  const [ isExpired, setIsEcpired ] = React.useState(false)
  console.log('===> XAVI <===: PrivateRoute -> isExpired', isExpired)

  React.useEffect(() => {
    const cookieAuth = Cookies.get('accessToken')
    const decodedToken = jwt.decode(cookieAuth, { complete: true })
    const dateNow = new Date()
    if(cookieAuth === undefined)
      return
    if(decodedToken === null)
      return
    if(decodedToken.payload.exp < dateNow.getTime())
      setIsEcpired(true)
  }, [])

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isExpired ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state   : { from: location }
            }} />
        )
      } />
  )
}

export default PrivateRoute
