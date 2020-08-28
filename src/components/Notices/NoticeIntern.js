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

const NoticeIntern = (props) => {
  const [userData, setUserData] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [expired, setExpired] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const loadNotice = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get(`/notice/${props.match.params.id}`, {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setTitle(res.data[0].title)
                setDescription(res.data[0].description)
                setExpired(res.data[0].expired_at)
              }
            } catch (err) {
              toast.error('Houve um problema ao carregar a notícia.')
            }
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar a notícia.')
          })
      } catch (_err) {}
    }

    loadToken()
    loadNotice()
  }, [props.match.params.id, userData])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (title.length === 0 || description.length === 0) {
      toast.error('Preencha o título e descrição para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        const headers = {
          Authorization: 'Bearer ' + userToken.token,
        }
        await api
          .put(
            `/notice/${props.match.params.id}`,
            {
              title: title,
              description: description,
              type: 'Notícia',
              expired_at: expired,
              // expired_at: Moment('YYYY-MM-DD hh:mm:ss').add('days', 5),
            },
            { headers: headers }
          )
          .then(async (res) => {
            toast.success('Comunicado alterado com sucesso!')
          })
          .catch((err) => {
            toast.error('Houve um problema ao alterar o comunicado!')
          })
      } catch (_err) {
        toast.error('Houve um problema ao alterar o comunicado!')
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
                  {'Comunicado'}
                </h3>
              </CardHeader>
              <CardFooter>
                <Form role="form">
                  <Row>
                    <Col lg="12" xl="12">
                      <FormGroup>
                        <p style={{ fontSize: 14 }}>
                          <b>*Por padrão os comunicados expiram em 5 dias.</b>
                        </p>
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
                  <Row>
                    <Col
                      lg="12"
                      xl="12"
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <FormGroup>
                        <Button
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={(e) => handleSubmit(e)}
                        >
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

export default NoticeIntern