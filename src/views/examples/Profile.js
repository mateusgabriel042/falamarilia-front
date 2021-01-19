import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/pt-br";

import api from "../../services/api";

const Profile = (props, { history }) => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [userService, setUserService] = useState("");
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [userData, setUserData] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [date, setDate] = useState("");

  moment.locale("pt-br");

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem("@user_data"));
    };

    const loadProfile = async () => {
      try {
        const userToken = JSON.parse(userData);
        await api
          .get("/profile", {
            headers: {
              Authorization: "Bearer " + userToken.token,
            },
          })
          .then(async (res) => {
            setDate(res.data.created_at);
            try {
              const data = res.data;
              setName(data.name);
              setUserName(data.name);
              setEmail(data.email);
              setCpf(data.cpf);
              setPhone(data.phone);
              setUserService(data.service);
              userType(data.type);
            } catch (err) {}
          })
          .catch((err) => {
            toast.error("Houve um problema ao carregar o perfil.");
          });
      } catch (_err) {}
    };

    loadToken();
    loadProfile();
  }, [userData, userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("As senhas não coincidem, corrija para continuar!");
    } else if (
      email.length === 0 ||
      name.length === 0 ||
      phone.length === 0 ||
      cpf.length === 0 ||
      (password && password.length === 0) ||
      (passwordConfirmation && passwordConfirmation.length === 0)
    ) {
      toast.error("Preencha os campos marcados com * para continuar!");
    } else {
      try {
        const userToken = JSON.parse(userData);
        const headers = {
          Authorization: "Bearer " + userToken.token,
        };
        await api
          .put(
            "/profile",
            {
              name: name,
              email: email,
              cpf: cpf,
              phone: phone,
              genre: "others",
              ...(password
                ? { password: password, password_confirmation: password }
                : {}),
            },
            { headers: headers }
          )
          .then(async (res) => {
            toast.success("Perfil alterado com sucesso!");
          })
          .catch((err) => {
            const response = err.response;
            let error = "Houve um problema ao alterar o seu perfil!";

            if (response && response.status == 500 && response.data) {
              const data = response.data;

              if (
                data.erro.includes("Duplicate entry") &&
                data.erro.includes("for key") &&
                data.erro.includes("profiles_cpf_unique")
              ) {
                error =
                  "O CPF digitado já existe no sistema cadastrado em outro usuário.";
              }

              if (
                data.erro.includes("Duplicate entry") &&
                data.erro.includes("for key") &&
                data.erro.includes("users_email_unique")
              ) {
                error =
                  "O e-mail digitado já existe no sistema como munícipe, gestor ou administrador";
              }
            }

            if (response && response.status == 422 && response.data) {
              const data = response.data;

              if (data.email) {
                error = data.email[0];
              } else if (data.cpf) {
                error = data.cpf[0];
              } else if (data.phone) {
                error = data.phone[0];
              } else if (data.password) {
                error = data.password[0];
              } else if (data.name) {
                error = data.name[0];
              }
            }
            toast.error(error);
          });
      } catch (_err) {
        toast.error("Houve um problema ao alterar o seu perfil!");
      }
    }
  };

  const myTrim = (x) => {
    return x.replace(/\s/g, "");
  };

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
                        src={require("assets/img/theme/avatar.png")}
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
                    {userService}
                  </div>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {userType ? "Gestor" : "Administrador"}
                  </div>
                  <hr className="my-4" />
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Usuário desde: {moment(date).format("DD/MM/YYYY - HH:mm")}
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
                            Nome<b style={{ color: "red" }}>*</b>
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
                            E-mail<b style={{ color: "red" }}>*</b>
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
                            {password ? <b style={{ color: "red" }}>*</b> : ""}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            placeholder="********"
                            type="password"
                            value={password}
                            onChange={(e) =>
                              setPassword(myTrim(e.target.value))
                            }
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
                              <b style={{ color: "red" }}>*</b>
                            ) : (
                              ""
                            )}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="********"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                              setPasswordConfirmation(myTrim(e.target.value))
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
                            CPF<b style={{ color: "red" }}>*</b>
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
                            Celular<b style={{ color: "red" }}>*</b>
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
                        style={{ display: "flex", justifyContent: "flex-end" }}
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
  );
};

export default Profile;
