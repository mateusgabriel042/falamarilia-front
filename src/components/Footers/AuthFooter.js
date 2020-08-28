import React from 'react'
import { Container, Row, Col } from 'reactstrap'

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear() + ' '}
                <a
                  className="font-weight-bold ml-1"
                  href="https://www.creative-tim.com?ref=adr-auth-footer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fala Marília
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Login
