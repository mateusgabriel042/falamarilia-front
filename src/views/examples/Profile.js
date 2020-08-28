import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap'
import UserHeader from 'components/Headers/UserHeader.js'
import { toast } from 'react-toastify'
import Moment from 'moment'
import 'moment/locale/pt-br'

import api from '../../services/api'

const Profile = (props, { history }) => {
  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [userData, setUserData] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [date, setDate] = useState('')

  Moment.locale('pt-br')

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem('@user_data'))
    }

    const loadProfile = async () => {
      try {
        const userToken = JSON.parse(userData)
        await api
          .get('/profile', {
            headers: {
              Authorization: 'Bearer ' + userToken.token,
            },
          })
          .then(async (res) => {
            try {
              const data = res.data

              setName(data.name)
              setUserName(data.name)
              setEmail(data.email)
              setCpf(data.cpf)
              setPhone(data.phone)
              setDate(data.created_at)
            } catch (err) {}
          })
          .catch((err) => {
            toast.error('Houve um problema ao carregar o perfil.')
          })
      } catch (_err) {}
    }

    loadToken()
    loadProfile()
  }, [userData])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== passwordConfirmation) {
      toast.error('As senhas não coincidem, corrija para continuar!')
    } else if (
      email.length === 0 ||
      name.length === 0 ||
      phone.length === 0 ||
      cpf.length === 0 ||
      (password && password.length === 0) ||
      (passwordConfirmation && passwordConfirmation.length === 0)
    ) {
      toast.error('Preencha os campos marcados com * para continuar!')
    } else {
      try {
        const userToken = JSON.parse(userData)
        const headers = {
          Authorization: 'Bearer ' + userToken.token,
        }
        await api
          .put(
            '/profile',
            {
              name: name,
              email: email,
              cpf: cpf,
              phone: phone,
              password: password,
              password_confirmation: password,
            },
            { headers: headers }
          )
          .then(async (res) => {
            toast.success('Perfil alterado com sucesso!')
          })
          .catch((err) => {
            toast.error('Houve um problema ao alterar o seu perfil!')
          })
      } catch (_err) {
        toast.error('Houve um problema ao alterar o seu perfil!')
      }
    }
  }

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require('assets/img/theme/avatar.png')}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                  </div>
                </Row>
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>{userName}</h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {'{profile.office}'}
                  </div>
                  <hr className="my-4" />
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Usuário desde: {Moment(date).format('DD/MM/YYYY')}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Minha conta</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form role="form" onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                    Informações de usuário
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6" xl="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Nome<b style={{ color: 'red' }}>*</b>
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="José da Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6" xl="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            E-mail<b style={{ color: 'red' }}>*</b>
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="jesse@example.com"
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
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Senha
                            {password ? <b style={{ color: 'red' }}>*</b> : ''}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            placeholder="********"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6" xl="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Repetir Senha
                            {passwordConfirmation ? (
                              <b style={{ color: 'red' }}>*</b>
                            ) : (
                              ''
                            )}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="********"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                              setPasswordConfirmation(e.target.value)
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Informações Pessoais
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6" xl="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            CPF<b style={{ color: 'red' }}>*</b>
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-city"
                            placeholder="44263258315"
                            type="text"
                            maxLength={11}
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6" xl="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Celular<b style={{ color: 'red' }}>*</b>
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-country"
                            placeholder="16999999999"
                            type="text"
                            maxLength={11}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col
                        lg="12"
                        xl="12"
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <FormGroup>
                          <Button
                            className="my-4"
                            color="primary"
                            type="submit"
                          >
                            Salvar
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile