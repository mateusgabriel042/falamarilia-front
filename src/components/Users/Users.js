import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  Modal,
  ModalHeader,
  FormGroup,
  Label,
  ModalBody,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ModalFooter,
  CardFooter,
  Button,
  Badge,
  Col,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Input,
  Container,
  Row,
} from 'reactstrap'
import Header from '../Headers/Header.js'
import { toast } from 'react-toastify'
import Moment from 'moment'
import 'moment/locale/pt-br'

import api from '../../services/api'

const Users = (props, { history }) => {
  const activeOptions = [
    { value: 0, label: 'Não' },
    { value: 1, label: 'Sim' },
  ]

  const icons = [
    'home',
    'flower',
    'bus',
    'account-hard-hat',
    'delete',
    'nature-people',
    'nature',
    'message-processing',
    'home-remove',
    'bank-remove',
    'cancel',
    'traffic-light',
  ]

  const [users, setUsers] = useState([])
  const [userData, setUserData] = useState('')
  const [services, setServices] = useState([])
  const [service, setService] = useState('')
  const [modal, setModal] = useState(false)
  const [active, setActive] = useState(1)
  const [color, setColor] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const validate = () => {
      const service = JSON.parse(userData)

      return service.service !== -1 ? props.history.push('/admin') : ''
    }

    const loadUsers = async () => {
      try {
        const userToken = JSON.parse(userData)

        await api
          .get('/list', {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setUsers(res.data)
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

    loadToken()
    loadServices()
    loadUsers()

    setTimeout(() => {
      validate()
    }, 1000)
  }, [history, props, userData])

  const toggleModal = () => setModal(!modal)

  const handleCreateUser = async (e) => {
    e.preventDefault()

    if (
      name.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      phone.length === 0 ||
      cpf.length === 0
    ) {
      toast.error('Preencha todos os campos para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        await api
          .post(
            '/auth/register',
            {
              name,
              email,
              password,
              password_confirmation: password,
              genre: 'others',
              phone,
              cpf,
              type: '2',
              resident: 1,
              service: service ? Number(service) : -1,
            },
            {
              headers: {
                Authorization: 'Bearer ' + userToken.token,
              },
            }
          )
          .then((res) => {
            try {
              toast.success('Usuário cadastrado com sucesso!')
              window.location.reload()
              toggleModal()
            } catch (err) {
              toast.error('Houve um problema ao cadastrar o usuário.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao cadastrar o usuário.')
          })
      } catch (_err) {}
    }
  }

  const handlePasswordReset = async (e, userEmail) => {
    e.preventDefault()
    try {
      const userToken = JSON.parse(userData)
      await api
        .post(
          '/password/send',
          {
            email: userEmail,
          },
          {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          }
        )
        .then(async (res) => {
          try {
            toast.success('Senha resetada e enviada por e-mail com sucesso.')
          } catch (err) {
            toast.error('Houve um problema ao resetar a senha.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao resetar a senha.')
        })
    } catch (_err) {}
  }

  const handleRemoveUser = async (e, userId) => {
    e.preventDefault()
    try {
      const userToken = JSON.parse(userData)
      await api
        .delete(`/delete/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + userToken.token,
          },
        })
        .then(async (res) => {
          try {
            const userRemove = users.filter((item, idx) => {
              return item.id === userId ? idx : -1
            })

            if (userRemove >= 0) {
              delete users[userRemove]
            }

            toast.success('Usuário removida com sucesso.')
          } catch (err) {
            toast.error('Houve um problema ao remover o usuário.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao remover o usuário.')
        })
    } catch (_err) {}
  }

  return (
    <>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Cadastrar Novo Usuário</ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="6" xl="6">
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
            <Col lg="6" xl="6">
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
          </Row>
          <Row>
            <Col lg="6" xl="6">
              <FormGroup>
                <Label for="password">Senha</Label>
                <Input
                  id="password"
                  placeholder="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col lg="6" xl="6">
              <FormGroup>
                <Label for="email">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="CPF Válido"
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg="6" xl="6">
              <FormGroup>
                <Label for="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="Telefone Válido"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col lg="6" xl="6">
              <FormGroup>
                <Label for="service">Secretaria</Label>
                <Input
                  id="service"
                  placeholder="Secretaria"
                  type="select"
                  value={services}
                  onChange={(e) => setService(e.target.value)}
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
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleCreateUser(e)}>
            Criar
          </Button>{' '}
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row style={{ alignItems: 'center' }}>
                  <Col lg="8" xl="8">
                    <h3 id="title" className="mb-0">
                      {props.data.title}
                    </h3>
                  </Col>
                  <Col
                    lg="4"
                    xl="4"
                    style={{ justifyContent: 'flex-end', display: 'flex' }}
                  >
                    <Button
                      className="my-4"
                      color="primary"
                      onClick={() => toggleModal()}
                    >
                      Novo Usuário
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {props.data.header.map((element, idx) => {
                      return (
                        <th key={idx} scope="col">
                          {element}
                        </th>
                      )
                    })}
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((element, idx) => {
                    return (
                      <tr key={idx}>
                        <th style={{ fontWeight: 'bold' }} scope="row">
                          {element.name}
                        </th>
                        <td>{element.email}</td>
                        <td
                          style={{
                            color: element.service?.color,
                            fontWeight: 'bold',
                          }}
                        >
                          {element.service?.name
                            ? element.service?.name
                            : 'Administração'}
                        </td>
                        <td>
                          {Moment(element.created_at).format(
                            'DD/MM/YYYY - HH:mm'
                          )}
                        </td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              role="button"
                              size="sm"
                              color=""
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={(e) => e.preventDefault()}>
                                <Link
                                  to={{
                                    pathname: `/admin/users/${element.id}`,
                                  }}
                                >
                                  Visualizar
                                </Link>
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) =>
                                  handlePasswordReset(e, element.email)
                                }
                              >
                                <Link>Resetar Senha(E-mail)</Link>
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) => handleRemoveUser(e, element.id)}
                              >
                                <Link>Remover</Link>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <CardFooter className="py-4"></CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default Users
