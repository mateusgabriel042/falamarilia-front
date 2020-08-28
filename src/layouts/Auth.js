import React, { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

// import AuthNavbar from 'components/Navbars/AuthNavbar.js'
import AuthFooter from 'components/Footers/AuthFooter.js'

import routes from 'routes.js'

const Auth = () => {
  useEffect(() => {
    document.body.classList.add('bg-default')

    return () => {
      document.body.classList.remove('bg-default')
    }
  }, [])

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/auth') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        )
      } else {
        return null
      }
    })
  }

  return (
    <>
      <div className="main-content">
        {/* <AuthNavbar /> */}
        <div className="header bg-gradient-info py-7 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <Link to="/">
                    <img alt="..." src={require('assets/img/brand/logo.png')} />
                  </Link>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to="/auth/login" />
            </Switch>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  )
}

export default Auth
