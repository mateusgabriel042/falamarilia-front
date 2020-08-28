import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  CardHeader,
  Table,
  Row,
  Col,
  Badge,
  Media,
} from 'reactstrap'
import { toast } from 'react-toastify'
import Moment from 'moment'
import 'moment/locale/pt-br'

import api from '../../services/api'

const LastSolicitations = () => {
  const [solicitations, setSolicitations] = useState([])
  const [userData, setUserData] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const loadLastSolicitations = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get('/solicitation?page=1', {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then(async (res) => {
            try {
              if (res.data) {
                setSolicitations(res.data.records)
              }
            } catch (err) {
              toast.error(
                'Houve um problema ao carregar as últimas solicitações.'
              )
            }
          })
          .catch((err) => {
            toast.error(
              'Houve um problema ao carregar as últimas solicitações.'
            )
          })
      } catch (_err) {}
    }

    loadToken()
    loadLastSolicitations()
  }, [userData])

  return (
    <Col className="mb-5 mb-xl-0" xl="12">
      <Card className="shadow">
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <div className="col">
              <h3 className="mb-0">Últimas 5 Solicitações</h3>
            </div>
            <div className="col text-right">
              <Link to="/admin/solicitations">
                <Button color="primary" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
          </Row>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">Protocolo</th>
              <th scope="col">Imagem</th>
              <th scope="col">Secretaria</th>
              <th scope="col">Status</th>
              <th scope="col">Usuário</th>
              <th scope="col">Data</th>
            </tr>
          </thead>
          <tbody>
            {solicitations.map((element, idx) => {
              while (idx <= 4) {
                return (
                  <tr>
                    <th style={{ fontWeight: 'bold' }} scope="row">
                      <Link to={`/admin/solicitations/${element.id}`}>
                        {element.protocol}
                      </Link>
                    </th>
                    <td>
                      <Media style={{ boxShadow: '4px 4px 8px #888888' }}>
                        <img
                          src={
                            element.photo !== 'noImage'
                              ? 'http://177.85.33.222:8080/' + element.photo
                              : require('assets/img/theme/noImage.jpg')
                          }
                          alt=""
                          style={{ width: 50, height: 50 }}
                        />
                      </Media>
                    </td>
                    <td style={{ color: element.service_color }}>
                      {element.service_name}
                    </td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i
                          className={
                            element.status === 'Aguardando Resposta'
                              ? 'bg-warning'
                              : element.status === 'Respondida'
                              ? 'bg-info'
                              : element.status === 'Finalizada'
                              ? 'bg-success'
                              : 'bg-yellow'
                          }
                        />
                        {element.status}
                      </Badge>
                    </td>
                    <td>{element.user_name}</td>
                    <td>
                      {Moment(element.created_at).format('DD/MM/YYYY - HH:mm')}
                    </td>
                  </tr>
                )
              }

              return ''
            })}
          </tbody>
        </Table>
      </Card>
    </Col>
  )
}

export default LastSolicitations
