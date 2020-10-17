import React, { useEffect, useState } from 'react'
import ServicesCategories from './ServicesCategories'
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

const ServicesIntern = (props, { history }) => {
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

  const [userData, setUserData] = useState('')
  const [active, setActive] = useState('')
  const [activeCategory, setActiveCategory] = useState(1)
  const [categories, setCategories] = useState([])
  const [icon, setIcon] = useState('home')
  const [iconCategory, setIconCategory] = useState('home')
  const [name, setName] = useState('')
  const [nameCategory, setNameCategory] = useState('')
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('')

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
          .get(`/service/${props.match.params.id}`, {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setName(res.data[0].name)
                setTitle(res.data[0].name)
                setColor(res.data[0].color)
                setActive(res.data[0].active)
                setIcon(res.data[0].icon)
                setCategories(res.data[0].category)
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar a secretaria.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar a secretaria.')
          })
      } catch (_err) {}
    }
    loadServices()

    const validate = () => {
      const service = JSON.parse(userData)

      return service.service !== -1 ? props.history.push('/admin') : ''
    }

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

  const handleCreateCategory = async (e) => {
    e.preventDefault()

    if (
      nameCategory.length === 0 ||
      activeCategory.length === 0 ||
      iconCategory.length === 0
    ) {
      toast.error('Preencha todos os campos de categoria para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        const headers = {
          Authorization: 'Bearer ' + userToken.token,
        }
        await api
          .post(
            '/service/category',
            {
              label: nameCategory,
              service_id: props.match.params.id,
              active: activeCategory,
              icon: iconCategory,
            },
            { headers: headers }
          )
          .then(async (res) => {
            categories.push(res.data)
            toast.success('Categoria cadastrada com sucesso!')

            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
          .catch((err) => {
            toast.error('Houve um problema ao cadastrar a categoria!')
          })
      } catch (_err) {
        toast.error('Houve um problema ao cadastrar a categoria!')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      name.length === 0 ||
      color.length === 0 ||
      active.length === 0 ||
      icon.length === 0
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
            `/service/${props.match.params.id}`,
            {
              name: name,
              active: active,
              color: color,
              icon: icon,
            },
            { headers: headers }
          )
          .then(async (res) => {
            toast.success('Secretaria alterada com sucesso!')
          })
          .catch((err) => {
            toast.error('Houve um problema ao alterar a Secretaria!')
          })
      } catch (_err) {
        toast.error('Houve um problema ao alterar a Secretaria!')
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
                  {'Secretaria de ' + title}
                </h3>
              </CardHeader>
              <CardFooter>
                <Form role="form" onSubmit={handleSubmit}>
                  <Row>
                    <Col lg="3" xl="3">
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
                    <Col lg="3" xl="3">
                      <FormGroup>
                        <Label for="color">Cor</Label>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i
                                style={{ color: color }}
                                className="ni ni-palette"
                              />
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
                    <Col lg="3" xl="3">
                      <FormGroup>
                        <Label for="active">Ativa</Label>
                        <Input
                          id="active"
                          placeholder="Ativo"
                          type="select"
                          value={active}
                          onChange={(e) => setActive(e.target.value)}
                        >
                          {activeOptions.map((element, idx) => {
                            return (
                              <option
                                key={idx}
                                value={element.value}
                                {...(active === element.value
                                  ? 'selected'
                                  : '')}
                              >
                                {element.label}
                              </option>
                            )
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="3" xl="3">
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
                            placeholder="Icone"
                            type="select"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                          >
                            {icons.map((element, idx) => {
                              return (
                                <option
                                  key={idx}
                                  value={element}
                                  {...(icon === element ? 'selected' : '')}
                                >
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
                    <Col
                      lg="12"
                      xl="12"
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <FormGroup>
                        <Button className="my-4" color="success" type="button" onClick={(e) => props.history.push('/admin/services')}>
                          Voltar
                        </Button>

                        <Button className="my-4" color="primary" type="submit">
                          Salvar
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardFooter>
              <Row>
                <div className="col">
                  <Card className="">
                    <CardHeader className="border-0">
                      <h3 id="title" className="mb-0">
                        {'Cadastro de Categoria'}
                      </h3>
                    </CardHeader>
                  </Card>
                </div>
              </Row>
              <Row>
                <div className="col">
                  <CardHeader className="border-0">
                    <Row>
                      <Col lg="3" xl="3">
                        <FormGroup>
                          <Label for="name">Nome</Label>
                          <Input
                            id="name"
                            placeholder="Nome"
                            type="text"
                            value={nameCategory}
                            onChange={(e) => setNameCategory(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="3" xl="3">
                        <FormGroup>
                          <Label for="active">Ativa</Label>
                          <Input
                            id="active"
                            placeholder="Ativo"
                            type="select"
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                          >
                            <option value={1} selected>
                              Sim
                            </option>
                            <option value={0}>Não</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="3" xl="3">
                        <FormGroup>
                          <Label for="color">Icone</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i
                                  style={{
                                    fontSize: '20px',
                                  }}
                                  class={'mdi mdi-' + iconCategory}
                                ></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Icone"
                              type="select"
                              onChange={(e) => setIconCategory(e.target.value)}
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
                      <Col
                        lg="12"
                        xl="12"
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <FormGroup>
                          <Button className="my-4" color="success" type="button" onClick={(e) => props.history.push('/admin/services')}>
                            Voltar
                          </Button>

                          <Button
                            className="my-4"
                            color="primary"
                            onClick={(e) => handleCreateCategory(e)}
                          >
                            Salvar
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardHeader>
                </div>
              </Row>
              <Row className="mt-5">
                <ServicesCategories categories={categories} />
              </Row>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default ServicesIntern
