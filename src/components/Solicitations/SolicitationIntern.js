import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import Header from "../Headers/Header.js";
import { toast } from "react-toastify";
import Moment from "moment";
import "moment/locale/pt-br";

import api from "../../services/api";

const SolicitationIntern = (props, { history }) => {
  const statusOptions = [
    "Finalizada",
    "Aguardando Resposta",
    "Respondida",
    "Em Andamento",
  ];

  const [userData, setUserData] = useState("");
  const [services, setServices] = useState([]);
  const [responsible, setResponsible] = useState(-1);
  const [status, setStatus] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState("");
  const [geolocation, setGeolocation] = useState("");
  const [geoloc, setGeoloc] = useState("");
  const [date, setDate] = useState("");
  const [read, setRead] = useState(false);
  const [protocol, setProtocol] = useState("");

  Moment.locale("pt-br");

  useEffect(() => {
    const loadToken = () => {
      setUserData(localStorage.getItem("@user_data"));
    };
    loadToken();

    const loadSolicitations = async () => {
      try {
        const userToken = JSON.parse(userData);
        setRead(userToken.service !== -1 ? true : false);
        await api
          .get(`/solicitation/admin/${props.match.params.id}`, {
            headers: {
              Authorization: "Bearer " + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setServiceName(res.data[0].service_name);
                setServiceId(res.data[0].service_id);
                setCategoryName(res.data[0].category_name);
                setUserName(res.data[0].user_name);
                setDescription(res.data[0].description);
                setComment(res.data[0].comment);
                setStatus(res.data[0].status);
                setPhoto(res.data[0].photo);
                setGeolocation(res.data[0].geolocation);
                setGeoloc(res.data[0].geoloc);
                setResponsible(res.data[0].responsible);
                setDate(res.data[0].created_at);
                setProtocol(res.data[0].protocol);
              }
            } catch (err) {
              toast.error("Houve um problema ao carregar a solicita????o.");
            }
          })
          .catch((err) => {
            toast.error("Houve um problema ao carregar a solicita????o.");
          });
      } catch (_err) {}
    };

    const loadServices = async () => {
      try {
        const userToken = JSON.parse(userData);
        await api
          .get(`/service`, {
            headers: {
              Authorization: "Bearer " + userToken.token,
            },
          })
          .then((res) => {
            try {
              if (res.data) {
                setServices(res.data);
              }
            } catch (err) {
              toast.error("Houve um problema ao carregar a solicita????o.");
            }
          })
          .catch((err) => {
            toast.error("Houve um problema ao carregar a solicita????o.");
          });
      } catch (_err) {}
    };

    loadSolicitations();
    loadServices();
  }, [props.match.params.id, userData]);

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    console.log(status);
    if (status.length === 0) {
      toast.error("Preencha o status para continuar!");
    } else {
      try {
        const userToken = JSON.parse(userData);
        const headers = {
          Authorization: "Bearer " + userToken.token,
        };
        await api
          .put(
            `/solicitation/${props.match.params.id}`,
            {
              status: status,
              comment: comment,
              responsible: responsible,
              service_id: responsible !== 0 ? responsible : serviceId,
            },
            { headers: headers }
          )
          .then(async (res) => {
            toast.success("Status alterado com sucesso!");
          })
          .catch((err) => {
            toast.error(
              "Houve um problema ao alterar o status da solicita????o!"
            );
          });
      } catch (_err) {
        toast.error("Houve um problema ao alterar o status da solicita????o!");
      }

      props.history.push("/admin/solicitations");
    }
  };

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
                  {"Solicita????o - " + protocol}
                </h3>
              </CardHeader>
              <CardFooter>
                <Form role="form">
                  <Row>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="service">Secretaria</Label>
                        <Input
                          id="service"
                          placeholder="Servi??o"
                          readOnly={true}
                          type="text"
                          value={serviceName}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="category">Categoria</Label>
                        <Input
                          id="category"
                          placeholder="Categoria"
                          type="text"
                          readOnly={true}
                          value={categoryName}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="user">Usu??rio</Label>
                        <Input
                          id="user"
                          placeholder="Usu??rio"
                          type="text"
                          readOnly={true}
                          value={userName}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" xl="3">
                      <FormGroup>
                        <Label for="date">Data de abertura</Label>
                        <Input
                          id="date"
                          placeholder="Data de abertura"
                          type="text"
                          readOnly={true}
                          value={Moment(date).format("DD/MM/YYYY - HH:mm")}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" xl="3">
                      <FormGroup>
                        <Label for="status">Status</Label>
                        <Input
                          id="status"
                          placeholder="Status"
                          type="select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          disabled={read && status === "Finalizada"}
                        >
                          {statusOptions.map((element, idx) => {
                            return (
                              <option key={idx} value={element}>
                                {element}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="address">Endere??o</Label>
                        <Input
                          id="address"
                          placeholder="Endere??o"
                          type="text"
                          readOnly={true}
                          value={
                            geolocation
                              ? geolocation
                              : "Usu??rio n??o inseriu endere??o."
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" xl="6">
                      <FormGroup>
                        <Label for="responsible">Secretaria Respons??vel</Label>
                        <Input
                          id="responsible"
                          placeholder="Endere??o"
                          type="select"
                          value={responsible}
                          disabled={read}
                          onChange={(e) => setResponsible(e.target.value)}
                        >
                          <option key={-1} value={""} selected>
                            N??o Atribuida
                          </option>
                          {services.map((element, idx) => {
                            return (
                              <option key={idx} value={element.id}>
                                {element.name}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" xl="12">
                      <FormGroup>
                        <Label for="description">
                          Descri????o da Solicita????o
                        </Label>
                        <Input
                          id="description"
                          placeholder="Descri????o da Solicita????o"
                          type="textarea"
                          rows={6}
                          readOnly={true}
                          value={description ?? ""}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" xl="12">
                      <FormGroup>
                        <Label for="comment">
                          Resposta da Solicita????o (max. 2000 caracteres)
                        </Label>
                        <Input
                          id="comment"
                          placeholder="Resposta da Solicita????o"
                          type="textarea"
                          rows={6}
                          maxLength="2000"
                          value={comment ?? ""}
                          disabled={read && status === "Finalizada"}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" xl="12">
                      <FormGroup>
                        <Label for="image">Imagem</Label>
                        <Media>
                          <img
                            src={
                              photo !== "noImage"
                                ? "http://177.85.33.222:8081/" + photo
                                : require("assets/img/theme/noImage.jpg")
                            }
                            alt=""
                            style={{ width: "300px", height: "300px" }}
                          />
                        </Media>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row style={{ justifyContent: "flex-end" }}>
                    <FormGroup>
                      <Button
                        className="my-4"
                        color="success"
                        type="button"
                        onClick={(e) =>
                          props.history.push("/admin/solicitations")
                        }
                      >
                        Voltar
                      </Button>

                      <Button
                        className="my-4"
                        color="primary"
                        onClick={(e) => handleSubmit(e, status)}
                      >
                        Salvar
                      </Button>
                    </FormGroup>
                  </Row>
                </Form>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SolicitationIntern;
