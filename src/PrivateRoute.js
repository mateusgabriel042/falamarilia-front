import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import authenticated from './utils/authenticated'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  )
}

export default PrivateRoute
