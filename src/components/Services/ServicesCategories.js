import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  CardHeader,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Row,
  Col,
  Badge,
  Media,
} from 'reactstrap'
import { toast } from 'react-toastify'
import Moment from 'moment'
import 'moment/locale/pt-br'

import api from '../../services/api'

const ServicesCategories = ({ categories }) => {
  const [userData, setUserData] = useState('')
  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    loadToken()
  }, [])

  const handleActiveCategory = async (e, serviceId, categoryId, active) => {
    e.preventDefault()
    try {
      const userToken = JSON.parse(userData)
      await api
        .put(
          `/service/${serviceId}/category/${categoryId}`,
          {
            active: active == 0 ? 1 : 0,
          },
          {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          }
        )
        .then(async (res) => {
          try {
            toast.success('Categoria atualizada com sucesso.')
          } catch (err) {
            toast.error('Houve um problema ao atualizada a categoria.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao atualizada a categoria.')
        })
    } catch (_err) {}
  }

  const handleRemoveCategory = async (e, serviceId, categoryId) => {
    e.preventDefault()
    try {
      const userToken = JSON.parse(userData)
      await api
        .delete(`/service/${serviceId}/category/${categoryId}`, {
          headers: {
            Authorization: 'Bearer ' + userToken.token,
          },
        })
        .then(async (res) => {
          try {
            const categoryRemove = categories.filter((item, idx) => {
              return item.id === categoryId ? idx : -1
            })

            if (categoryRemove >= 0) {
              delete categories[categoryRemove]
            }

            toast.success('Categoria removida com sucesso.')
          } catch (err) {
            toast.error('Houve um problema ao remover a categoria.')
          }
        })
        .catch((err) => {
          toast.error('Houve um problema ao remover a categoria.')
        })
    } catch (_err) {}
  }

  return (
    <Col className="mb-5 mb-xl-0" xl="12">
      <Card className="shadow">
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <div className="col">
              <h3 className="mb-0">Categorias</h3>
            </div>
          </Row>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Ativa</th>
              <th scope="col">Icone</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((element, idx) => {
              return (
                <tr>
                  <th style={{ fontWeight: 'bold' }} scope="row">
                    {element.label}
                  </th>
                  <td>
                    <Badge color="" className="badge-dot mr-4">
                      <i
                        className={
                          element.active == 1
                            ? 'bg-success'
                            : element.active == 0
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
                        <DropdownItem
                          onClick={(e) =>
                            handleActiveCategory(
                              e,
                              element.service_id,
                              element.id,
                              element.active
                            )
                          }
                        >
                          <Link>Ativar/Desativar</Link>
                        </DropdownItem>
                        <DropdownItem
                          onClick={(e) =>
                            handleRemoveCategory(
                              e,
                              element.service_id,
                              element.id
                            )
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
      </Card>
    </Col>
  )
}

export default ServicesCategories
