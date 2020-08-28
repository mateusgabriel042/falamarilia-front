import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardFooter,
  Badge,
  Col,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  // Media,
  Pagination,
  PaginationItem,
  PaginationLink,
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

const Solicitations = (props) => {
  const [solicitations, setSolicitations] = useState([])
  const [userData, setUserData] = useState('')
  const [page, setPage] = useState(1)
  const [pageProtocol, setPageProtocol] = useState(1)
  const [solicitationsMeta, setSolicitationsMeta] = useState({})

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const loadSolicitations = async (page = 1) => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get(`/solicitation?page=${page}`, {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setSolicitations(res.data.records)
                setSolicitationsMeta(res.data.meta)
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
    loadSolicitations(page)
  }, [page, userData])

  const searchProtocol = async (value, page = 1) => {
    try {
      const userToken = JSON.parse(userData)
      await api
        .get(`/solicitation/search/protocol?page=${page}&search=${value}`, {
          headers: {
            Authorization: 'Bearer ' + userToken.token,
          },
        })
        .then((res) => {
          try {
            if (res.data) {
              setSolicitations(res.data.records)
              setSolicitationsMeta(res.data.meta)
            }

            if (res.data.records.length === 0)
              toast.warning('Não encontramos nenhum protocolo com este número.')
          } catch (err) {}
        })
        .catch((err) => {})
    } catch (_err) {}
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
                <Row style={{ alignItems: 'center' }}>
                  <Col lg="8" xl="8">
                    <h3 id="title" className="mb-0">
                      {props.data.title}
                    </h3>
                  </Col>
                  <Col lg="4" xl="4" style={{ justifyContent: 'flex-end' }}>
                    <Input
                      id="search"
                      placeholder="Busca"
                      type="text"
                      onChange={(e) => searchProtocol(e.target.value, 1)}
                    />
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
                  {solicitations.map((element, idx) => {
                    return (
                      <tr key={idx}>
                        <th style={{ fontWeight: 'bold' }} scope="row">
                          {element.protocol}
                        </th>
                        {/* <td>
                          <Media style={{ boxShadow: '4px 4px 8px #888888' }}>
                            <img
                              src={
                                element.photo !=== 'noImage'
                                  ? 'http://192.168.0.23:8080/' + element.photo
                                  : require('assets/img/theme/noImage.jpg')
                              }
                              alt=""
                              style={{ width: 50 }}
                            />
                          </Media>
                        </td> */}
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
                                    pathname: `/admin/solicitations/${element.id}`,
                                  }}
                                >
                                  Visualizar
                                </Link>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem
                      className={solicitationsMeta.page > 1 ? '' : 'disabled'}
                    >
                      <PaginationLink
                        href="#title"
                        onClick={() => setPage(page - 1)}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Anterior</span>
                      </PaginationLink>
                    </PaginationItem>

                    {[...Array(solicitationsMeta.pagesQty)].map(
                      (element, idx) => {
                        return (
                          <PaginationItem
                            className={
                              idx + 1 == solicitationsMeta.page ? 'active' : ''
                            }
                            key={idx}
                          >
                            <PaginationLink
                              href="#title"
                              onClick={() => setPage(idx + 1)}
                            >
                              {idx + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }
                    )}
                    <PaginationItem
                      className={
                        solicitationsMeta.page == solicitationsMeta.pagesQty
                          ? 'disabled'
                          : solicitationsMeta.pagesQty <= 1
                          ? 'disabled'
                          : ''
                      }
                    >
                      <PaginationLink
                        href="#title"
                        onClick={() => setPage(page + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Próxima</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default Solicitations
