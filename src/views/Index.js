import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import {
  Card,
  CardHeader,
  CardBody,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap'

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from 'variables/charts.js'
import { toast } from 'react-toastify'
import Header from 'components/Headers/Header.js'
import LastSolicitations from 'components/Solicitations/LastSolicitations.js'

import api from '../services/api'

const Index = ({ history }) => {
  const [totalOrders, setTotalOrders] = useState([])
  const [userData, setUserData] = useState([])

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const loadGraphics = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get('/badges/groupsolicitations', {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then(async (res) => {
            try {
              if (res.data) {
                let totalSolicitations = []

                res.data.forEach((element) => {
                  totalSolicitations.push({
                    month:
                      element.month === 'January'
                        ? 'JAN'
                        : element.month === 'February'
                        ? 'FEV'
                        : element.month === 'March'
                        ? 'MAR'
                        : element.month === 'April'
                        ? 'ABR'
                        : element.month === 'May'
                        ? 'MAI'
                        : element.month === 'June'
                        ? 'JUN'
                        : element.month === 'July'
                        ? 'JUL'
                        : element.month === 'August'
                        ? 'AGO'
                        : element.month === 'September'
                        ? 'SET'
                        : element.month === 'October'
                        ? 'OUT'
                        : element.month === 'November'
                        ? 'NOV'
                        : element.month === 'December'
                        ? 'DEZ'
                        : '',
                    qty: element.data,
                  })
                })

                setTotalOrders({
                  labels: totalSolicitations.map((element) => {
                    return element.month
                  }),
                  datasets: [
                    {
                      label: 'Solicitations',
                      data: totalSolicitations.map((element) => {
                        return element.qty
                      }),
                      maxBarThickness: 10,
                    },
                  ],
                })
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar as estatísticas.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar as estatísticas.')
          })
      } catch (_err) {}
    }

    loadToken()
    loadGraphics()
  }, [history, userData])

  if (window.Chart) {
    parseOptions(Chart, chartOptions())
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Solicitações
                    </h6>
                    <h2 className="mb-0">Últimos 12 meses</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills></Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={totalOrders}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Solicitações
                    </h6>
                    <h2 className="mb-0">Últimos 6 meses</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar data={totalOrders} options={chartExample2.options} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <LastSolicitations />
        </Row>
      </Container>
    </>
  )
}

export default Index
