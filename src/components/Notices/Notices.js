import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Button,
  Row,
} from 'reactstrap'
import Header from '../Headers/Header.js'
import { toast } from 'react-toastify'
import Moment from 'moment'
import 'moment/locale/pt-br'

import api from '../../services/api'

const Notices = (props) => {
  const [notices, setNotices] = useState([])
  const [title, setTitle] = useState([])
  const [description, setDescription] = useState([])
  const [userData, setUserData] = useState('')
  const [modal, setModal] = useState(false)
  const [date, setDate] = useState(new Date())
  const [expired, setExpired] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const loadNotices = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get(`/notice`, {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              console.log(res.data)
              if (res.data) {
                setNotices(res.data)
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar as notícias.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar as notícias.')
          })
      } catch (_err) {}
    }

    loadToken()
    loadNotices()
  }, [userData])

  const load = async () => {
    try {
      const userToken = JSON.parse(userData)
      await api
        .get(`/notice`, {
          headers: {
            Authorization: 'Bearer ' + userToken.token,
          },
        })
        .then((res) => {
          try {
            console.log(res.data)
            if (res.data) {
              setNotices(res.data)
            }
          } catch (err) {
            toast.error('Houve um problema ao carregar as notícias.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao carregar as notícias.')
        })
    } catch (_err) {}
  }

  const handleRemove = async (e, noticeId) => {
    e.preventDefault()
    try {
      const userToken = JSON.parse(userData)
      await api
        .delete(`/notice/${noticeId}`, {
          headers: {
            Authorization: 'Bearer ' + userToken.token,
          },
        })
        .then(async (res) => {
          try {
            load()

            toast.success('Comunicado removido com sucesso.')
          } catch (err) {
            toast.error('Houve um problema ao remover o comunicado.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao remover o comunicado.')
        })
    } catch (_err) {}
  }

  const toggleModal = () => setModal(!modal)

  const handleCreateNotice = async (e) => {
    e.preventDefault()

    if (title.length === 0 || description.length === 0) {
      toast.error('Preencha todos os campos para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        await api
          .post(
            '/notice',
            {
              title: title,
              description: description,
              type: 'Notícia',
              expired_at: Moment(expired).format('YYYY-MM-DD 00:mm:ss'),
            },
            {
              headers: {
                Authorization: 'Bearer ' + userToken.token,
              },
            }
          )
          .then((res) => {
            try {
              toast.success('Comunicado cadastrado com sucesso!')
              notices.push(res.data)
              toggleModal()
            } catch (err) {
              toast.error('Houve um problema ao cadastrar o comunicado.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao cadastrar o comunicado.')
          })
      } catch (_err) {}
    }
  }

  return (
    <>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Cadastrar Novo Comunicado
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="12" xl="12">
              <FormGroup>
                <Label for="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12">
              <FormGroup>
                <Label for="expired_at">Dt. de Expiração</Label>
                <Input
                  id="expired_at"
                  placeholder="Dt. de Expiração"
                  type="date"
                  min={Moment().format('YYYY-MM-DD')}
                  value={Moment(expired).format('YYYY-MM-DD')}
                  onChange={(e) => setExpired(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12">
              <FormGroup>
                <Label for="description">Descrição do Comunicado</Label>
                <Input
                  id="description"
                  placeholder="Descrição do Comunicado"
                  type="textarea"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleCreateNotice(e)}>
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
                      Novo Comunicado
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
                  {notices.map((element, idx) => {
                    return (
                      <tr key={idx}>
                        <th style={{ fontWeight: 'bold' }} scope="row">
                          {element.title}
                        </th>
                        <td>
                          {Moment(element.expired_at).format(
                            'DD/MM/YYYY - HH:mm'
                          )}
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
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={(e) => e.preventDefault()}>
                                <Link
                                  to={{
                                    pathname: `/admin/comunicates/${element.id}`,
                                  }}
                                >
                                  Visualizar
                                </Link>
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) => handleRemove(e, element.id)}
                              >
                                <Link>Deletar</Link>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default Notices
