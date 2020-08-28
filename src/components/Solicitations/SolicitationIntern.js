import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardFooter,
  Label,
  Button,
  Form,
  FormGroup,
  Input,
  Media,
  Container,
  Row,
  Col,
} from 'reactstrap'
import Header from '../Headers/Header.js'
import { toast } from 'react-toastify'
import Moment from 'moment'
import 'moment/locale/pt-br'

import api from '../../services/api'

const SolicitationIntern = (props) => {
  const statusOptions = ['Finalizada', 'Aguardando Resposta', 'Respondida']

  const [userData, setUserData] = useState('')
  const [status, setStatus] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [userName, setUserName] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const [geolocation, setGeolocation] = useState('')
  const [geoloc, setGeoloc] = useState('')
  const [date, setDate] = useState('')
  const [protocol, setProtocol] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }
    loadToken()

    const loadSolicitations = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get(`/solicitation/admin/${props.match.params.id}`, {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setServiceName(res.data[0].service_name)
                setCategoryName(res.data[0].category_name)
                setUserName(res.data[0].user_name)
                setDescription(res.data[0].description)
                setStatus(res.data[0].status)
                setPhoto(res.data[0].photo)
                setGeolocation(res.data[0].geolocation)
                setGeoloc(res.data[0].geoloc)
                setDate(res.data[0].created_at)
                setProtocol(res.data[0].protocol)
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar a solicitação.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar a solicitação.')
          })
      } catch (_err) {}
    }
    loadSolicitations()
  }, [props.match.params.id, userData])

  const handleSubmit = async (e, status) => {
    e.preventDefault()

    setStatus(status)
    if (status.length === 0) {
      toast.error('Preencha o status para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        const headers = {
          Authorization: 'Bearer ' + userToken.token,
        }
        await api
          .put(
            `/solicitation/${props.match.params.id}`,
            {
              status: status,
            },
            { headers: headers }
          )
          .then(async (res) => {
            toast.success('Status alterado com sucesso!')
          })
          .catch((err) => {
            toast.error('Houve um problema ao alterar o status da solicitação!')
          })
      } catch (_err) {
        toast.error('Houve um problema ao alterar o status da solicitação!')
      }
    }
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 id="title" className="mb-0">
                  {'Solicitação - ' + protocol}
                </h3>
              </CardHeader>
              <CardFooter>
                <Form role="form">
                  <Row>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="service">Serviço</Label>
                        <Input
                          id="service"
                          placeholder="Serviço"
                          readOnly={true}
                          type="text"
                          value={serviceName}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="category">Categoria</Label>
                        <Input
                          id="category"
                          placeholder="Categoria"
                          type="text"
                          readOnly={true}
                          value={categoryName}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="user">Usuário</Label>
                        <Input
                          id="user"
                          placeholder="Usuário"
                          type="text"
                          readOnly={true}
                          value={userName}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" xl="3">
                      <FormGroup>
                        <Label for="date">Data de abertura</Label>
                        <Input
                          id="date"
                          placeholder="Data de abertura"
                          type="text"
                          readOnly={true}
                          value={Moment(date).format('DD/MM/YYYY - HH:mm')}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" xl="3">
                      <FormGroup>
                        <Label for="status">Status</Label>
                        <Input
                          id="status"
                          placeholder="Status"
                          type="select"
                          value={status}
                          onChange={(e) => handleSubmit(e, e.target.value)}
                        >
                          {statusOptions.map((element, idx) => {
                            return (
                              <option key={idx} value={element}>
                                {element}
                              </option>
                            )
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  {geolocation ? (
                    <Row>
                      <Col lg="12" xl="12">
                        <FormGroup>
                          <Label for="address">Endereço</Label>
                          <Input
                            id="address"
                            placeholder="Endereço"
                            type="text"
                            readOnly={true}
                            value={geolocation}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    <></>
                  )}
                  <Row>
                    <Col lg="12" xl="12">
                      <FormGroup>
                        <Label for="description">Descrição da Solcitação</Label>
                        <Input
                          id="description"
                          placeholder="Descrição da Solcitação"
                          type="textarea"
                          rows={6}
                          readOnly={true}
                          value={description}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" xl="12">
                      <FormGroup>
                        <Label for="image">Imagem</Label>
                        <Media>
                          <img
                            src={
                              photo !== 'noImage'
                                ? 'http://192.168.0.23:8080/' + photo
                                : require('assets/img/theme/noImage.jpg')
                            }
                            alt=""
                            style={{ width: '300px', height: '300px' }}
                          />
                        </Media>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default SolicitationIntern