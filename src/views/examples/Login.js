import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap'
import { toast } from 'react-toastify'
import api from '../../services/api'
import authenticated from '../../utils/authenticated'

const Login = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    authenticated().then((res) => {
      if (res === true) history.push('/admin')
      setIsAuthenticated(true)
    })
  }, [history, isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (email.length === 0 || password.length === 0) {
      toast.error('Preencha usuário e senha para continuar!')
    } else {
      try {
        await api
          .post('/auth/login', {
            email: email,
            password: password,
            password_confirmation: password,
          })
          .then(async (res) => {
            try {
              if (res.data.type !== 1) {
                localStorage.setItem('@user_data', JSON.stringify(res.data))
                toast.success('Login efetuado com sucesso!')
                history.push('/admin')
              } else {
                toast.warning('Login não encontrado!')
              }
            } catch (err) {}
          })
          .catch((err) => {
            toast.error(
              'Login ou senha inválido(s), verifique as suas credenciais!'
            )
          })
      } catch (_err) {
        toast.error(
          'Houve um problema com o login, verifique as suas credenciais!'
        )
      }
    }
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="E-mail"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Senha"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Lembrar-me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Login
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Esqueceu sua senha?</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  )
}

export default Login
