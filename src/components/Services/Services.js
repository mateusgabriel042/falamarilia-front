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

const Services = (props, { history }) => {
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

  const [services, setServices] = useState([])
  const [userData, setUserData] = useState('')
  const [modal, setModal] = useState(false)
  const [active, setActive] = useState(1)
  const [activeNew, setActiveNew] = useState(1)
  const [icon, setIcon] = useState('home')
  const [color, setColor] = useState('#000000')
  const [name, setName] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const validate = () => {
      const service = JSON.parse(userData)

      return service.service !== -1 ? props.history.push('/admin') : ''
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

    setTimeout(() => {
      validate()
    }, 1000)
  }, [history, props, userData])

  const toggleModal = () => setModal(!modal)

  const handleCreateService = async (e) => {
    e.preventDefault()

    if (
      name.length === 0 ||
      color.length === 0 ||
      icon.length === 0 ||
      active.length === 0
    ) {
      toast.error('Preencha todos os campos para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        await api
          .post(
            '/service',
            {
              name: name,
              color: color,
              icon: icon,
              active: activeNew,
            },
            {
              headers: {
                Authorization: 'Bearer ' + userToken.token,
              },
            }
          )
          .then((res) => {
            try {
              toast.success('Secretaria cadastrada com sucesso!')

              res.data.active = activeNew
              services.push(res.data)
              toggleModal()
            } catch (err) {
              toast.error('Houve um problema ao cadastrar a secretaria.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao cadastrar a secretaria.')
          })
      } catch (_err) {}
    }
  }

  const handleRemoveService = async (e, serviceId) => {
    e.preventDefault()
    try {
      const userToken = JSON.parse(userData)
      await api
        .delete(`/service/${serviceId}`, {
          headers: {
            Authorization: 'Bearer ' + userToken.token,
          },
        })
        .then(async (res) => {
          try {
            const serviceRemove = services.filter((item, idx) => {
              return item.id === serviceId ? idx : -1
            })

            if (serviceRemove >= 0) {
              delete services[serviceRemove]
            }

            toast.success('Secretaria removida com sucesso.')
          } catch (err) {
            toast.error('Houve um problema ao remover a secretaria.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao remover a secretaria.')
        })
    } catch (_err) {}
  }

  const handleActiveService = async (
    e,
    serviceId,
    active,
    icon,
    color,
    name
  ) => {
    // e.preventDefault()
    try {
      const userToken = JSON.parse(userData)
      await api
        .put(
          `/service/${serviceId}`,
          {
            active: active === 0 ? 1 : 0,
            icon: icon,
            name: name,
            color: color,
          },
          {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          }
        )
        .then(async (res) => {
          try {
            window.location.reload(true)
            toast.success('Secretaria atualizada com sucesso.')
          } catch (err) {
            toast.error('Houve um problema ao atualizada a secretaria.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao atualizada a secretaria.')
        })
    } catch (_err) {}
  }

  return (
    <>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Cadastrar Nova Secretaria
        </ModalHeader>
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
                <Label for="color">Icone</Label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i
                        style={{
                          fontSize: '20px',
                        }}
                        class={'mdi mdi-' + icon}
                      ></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Cor"
                    type="select"
                    onChange={(e) => setIcon(e.target.value)}
                  >
                    {icons.map((element, idx) => {
                      return (
                        <option key={idx} value={element}>
                          {element}
                        </option>
                      )
                    })}
                  </Input>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg="6" xl="6">
              <FormGroup>
                <Label for="color">Cor</Label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i style={{ color: color }} className="ni ni-palette" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Cor"
                    type="color"
                    value={color}
                    maxLength="7"
                    onChange={(e) => setColor(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col lg="6" xl="6">
              <FormGroup>
                <Label for="active">Ativa</Label>
                <Input
                  id="active"
                  placeholder="Ativo"
                  type="select"
                  value={activeNew}
                  onChange={(e) => setActiveNew(e.target.value)}
                >
                  <option value={1} selected>
                    Sim
                  </option>
                  <option value={0}>Não</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleCreateService(e)}>
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
                      Nova Secretaria
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
                  {services.map((element, idx) => {
                    return (
                      <tr key={idx}>
                        <th style={{ fontWeight: 'bold' }} scope="row">
                          {element.name}
                        </th>
                        <td
                          style={{ color: element.color, fontWeight: 'bold' }}
                        >
                          {element.color}
                        </td>
                        <td
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Badge color="" className="badge-dot mr-4">
                            <i
                              className={
                                element.active === 1
                                  ? 'bg-success'
                                  : element.active === 0
                                  ? 'bg-danger'
                                  : 'bg-warning'
                              }
                            />
                            {element.status}
                          </Badge>
                        </td>
                        <td>
                          <i
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              fontSize: '30px',
                            }}
                            class={'mdi mdi-' + element.icon}
                          ></i>
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
                                    pathname: `/admin/services/${element.id}`,
                                  }}
                                >
                                  Visualizar
                                </Link>
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) =>
                                  handleActiveService(
                                    e,
                                    element.id,
                                    element.active,
                                    element.icon,
                                    element.color,
                                    element.name
                                  )
                                }
                              >
                                <Link>Ativar/Desativar</Link>
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) =>
                                  handleRemoveService(e, element.id)
                                }
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

export default Services
