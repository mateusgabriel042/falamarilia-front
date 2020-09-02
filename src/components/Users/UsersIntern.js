import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  Button,
  CardFooter,
  Label,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  FormGroup,
  Form,
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

const UsersIntern = (props, { history }) => {
  const [userData, setUserData] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('')
  const [service, setService] = useState(-1)
  const [services, setServices] = useState([])
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }
    loadToken()

    const loadServices = async () => {
      try {
        const userToken = JSON.parse(userData)

        await api
          .get('/service', {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setServices(res.data)
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar as secretarias.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar as secretarias.')
          })
      } catch (_err) {}
    }

    const loadUser = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get(`/list/${props.match.params.id}`, {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setName(res.data[0].name)
                setEmail(res.data[0].email)
                setType(res.data[0].type)
                setService(res.data[0].service?.id)
                setCpf(res.data[0].profile.cpf)
                setPhone(res.data[0].profile.phone)
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar o usuário.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar o usuário.')
          })
      } catch (_err) {}
    }
    loadUser()

    const validate = () => {
      const service = JSON.parse(userData)

      return service.service !== -1 ? props.history.push('/admin') : ''
    }

    loadServices()
    setTimeout(() => {
      validate()
    }, 1000)
  }, [
    history,
    props.history,
    props.location,
    props.location.state,
    props.match.params.id,
    userData,
  ])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      name.length === 0 ||
      email.length === 0 ||
      service.length === 0 ||
      cpf.length === 0 ||
      phone.length === 0
    ) {
      toast.error('Preencha todos os campos para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        const headers = {
          Authorization: 'Bearer ' + userToken.token,
        }
        await api
          .put(
            `/list/${props.match.params.id}`,
            {
              name,
              email,
              service,
              type,
              cpf,
              phone,
            },
            { headers: headers }
          )
          .then(async (res) => {
            toast.success('Usuário alterado com sucesso!')
          })
          .catch((err) => {
            toast.error('Houve um problema ao alterar o usuário!')
          })
      } catch (_err) {
        toast.error('Houve um problema ao alterar o usuário!')
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
                  {'Atualização de Usuário'}
                </h3>
              </CardHeader>
              <CardFooter>
                <Form role="form" onSubmit={handleSubmit}>
                  <Row>
                    <Col lg="4" xl="4">
                      <FormGroup>
                        <Label for="name">Nome</Label>
                        <Input
                          id="name"
                          placeholder="Nome"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" xl="4">
                      <FormGroup>
                        <Label for="email">E-mail</Label>
                        <Input
                          id="email"
                          placeholder="E-mail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" xl="4">
                      <FormGroup>
                        <Label for="service">Secretaria</Label>
                        <Input
                          id="service"
                          placeholder="Secretaria"
                          type="select"
                          value={service}
                          onChange={(e) => setService(Number(e.target.value))}
                        >
                          <option value="-1">{'Administrador'}</option>
                          {services.map((element, idx) => {
                            return (
                              <option key={idx} value={element.id}>
                                {element.name}
                              </option>
                            )
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4" xl="4">
                      <FormGroup>
                        <Label for="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="CPF"
                          type="text"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" xl="4">
                      <FormGroup>
                        <Label for="phone">Telefone</Label>
                        <Input
                          id="phone"
                          placeholder="Telefone"
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg="12"
                      xl="12"
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <FormGroup>
                        <Button className="my-4" color="primary" type="submit">
                          Salvar
                        </Button>
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

export default UsersIntern
