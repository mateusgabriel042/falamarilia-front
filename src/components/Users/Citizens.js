import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
  Col,
  Table,
  Container,
  Row,
} from 'reactstrap'
import Header from '../Headers/Header.js'
import { toast } from 'react-toastify'
import Moment from 'moment'
import 'moment/locale/pt-br'

import api from '../../services/api'

const Citizens = (props, { history }) => {
  const [users, setUsers] = useState([])
  const [usersMeta, setUsersMeta] = useState({})
  const [page, setPage] = useState(1)
  const [userData, setUserData] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const validate = () => {
      const service = JSON.parse(userData)

      return service.service !== -1 ? props.history.push('/admin') : ''
    }

    const loadUsers = async (page = 1) => {
      try {
        const userToken = JSON.parse(userData)

        await api
          .get(`/simpleUsers?page=${page}`, {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setUsers(res.data.records)
                setUsersMeta(res.data.meta)
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar os usuários.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar os usuários.')
          })
      } catch (_err) {}
    }

    loadToken()
    loadUsers(page)

    setTimeout(() => {
      validate()
    }, 1000)
  }, [history, page, props, userData])

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
                      {props.data.title + ` - Total: ${usersMeta.totalRecords}`}
                    </h3>
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
                        <td>{element.profile?.cpf}</td>
                        <td>{element.profile?.phone}</td>
                        <td>
                          {element.profile?.resident === 1 ? 'Sim' : 'Não'}
                        </td>
                        <td>
                          {Moment(element.created_at).format(
                            'DD/MM/YYYY - HH:mm'
                          )}
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
                      className={usersMeta.page > 1 ? '' : 'disabled'}
                    >
                      <PaginationLink
                        href="#title"
                        onClick={() => setPage(page - 1)}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Anterior</span>
                      </PaginationLink>
                    </PaginationItem>

                    {[...Array(usersMeta.pagesQty)].map((element, idx) => {
                      return (
                        <PaginationItem
                          className={idx + 1 == usersMeta.page ? 'active' : ''}
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
                    })}
                    <PaginationItem
                      className={
                        usersMeta.page == usersMeta.pagesQty
                          ? 'disabled'
                          : usersMeta.pagesQty <= 1
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

export default Citizens
