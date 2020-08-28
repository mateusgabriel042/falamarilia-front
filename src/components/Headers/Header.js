import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap'
import { toast } from 'react-toastify'

import api from '../../services/api'

const Header = () => {
  const [badges, setBadges] = useState({})
  const [userData, setUserData] = useState('')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const loadBadges = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get('/badges/qtysolicitations', {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then(async (res) => {
            try {
              setBadges(res.data)
            } catch (err) {}
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar as estatísticas.')
          })
      } catch (_err) {
        // toast.error('Houve um problema ao carregar as estatísticasa.')
      }
    }
    loadToken()
    loadBadges()
  }, [userData])

  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: '400px',
          backgroundImage:
            'url(' + require('assets/img/theme/bg-cover.jpg') + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {badges.solicitationsQty ?? 0}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                          <i className="fas fa-comment" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span
                        className="text-nowrap"
                        style={{ fontSize: '0.775rem' }}
                      >
                        *Total de Solicitações
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Atendidas
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {badges.solicitationsAnswered ?? 0}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-grin-beam" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span
                        className="text-nowrap"
                        style={{ fontSize: '0.775rem' }}
                      >
                        *Total de Solicitações atendidas
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Pendentes
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {badges.solicitationsUnanswered ?? 0}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-meh" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span
                        className="text-nowrap"
                        style={{ fontSize: '0.775rem' }}
                      >
                        *Total de Solicitações Pendentes
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Em Atraso
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {badges.solicitationsLate ?? 0}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-angry" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span
                        className="text-nowrap"
                        style={{ fontSize: '0.775rem' }}
                      >
                        *Total de Solicitações em Atraso
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Header
