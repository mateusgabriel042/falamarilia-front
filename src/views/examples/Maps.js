import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps'
import { toast } from 'react-toastify'

import {
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  CardFooter,
  Media,
} from 'reactstrap'
import Header from 'components/Headers/Header.js'

import api from '../../services/api'

let totalSolicitations = 0

const MapWrapper = withScriptjs(
  withGoogleMap((props) => {
    const [isOpen, setIsOpen] = useState({ marker: 0, isOpen: true })
    const [solicitations, setSolicitations] = useState([])
    const [solicitationsMarker, setSolicitationsMaker] = useState([])
    const [userData, setUserData] = useState('')

    useEffect(() => {
      const loadToken = () => {
        setUserData(localStorage.getItem('@user_data'))
      }

      const getSolicitations = async (page = 1) => {
        try {
          const userToken = JSON.parse(userData)
          await api
            .get(`/solicitation?page=${page}&waiting=true`, {
              headers: {
                Authorization: 'Bearer ' + userToken.token,
              },
            })
            .then((res) => {
              try {
                if (res.data) {
                  setSolicitations(res.data.records)
                }
              } catch (err) {}
            })
            .catch((err) => {})
        } catch (_err) {}
      }

      loadToken()
      getSolicitations(1)
      totalSolicitations = solicitations.length
    }, [solicitations, userData])

    const handleOpenInfoWindow = (idx) => {
      setIsOpen({
        marker: idx,
        isOpen: !isOpen.isOpen,
      })
    }

    return (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{ lat: -22.2187469, lng: -49.9569446 }}
        defaultOptions={{
          scrollwheel: false,
          styles: [
            {
              featureType: 'administrative',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#444444' }],
            },
            {
              featureType: 'landscape',
              elementType: 'all',
              stylers: [{ color: '#f2f2f2' }],
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'road',
              elementType: 'all',
              stylers: [{ saturation: -100 }, { lightness: 45 }],
            },
            {
              featureType: 'road.highway',
              elementType: 'all',
              stylers: [{ visibility: 'simplified' }],
            },
            {
              featureType: 'road.arterial',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'water',
              elementType: 'all',
              stylers: [{ color: '#5e72e4' }, { visibility: 'on' }],
            },
          ],
        }}
      >
        {/* <Marker position={{ lat: -22.2187469, lng: -49.9569446 }} /> */}
        {solicitations ? (
          solicitations.map((element, idx) => {
            // console.log(element)
            const geoloc = JSON.parse(element.geoloc)
            return (
              <Marker
                key={idx}
                position={{ lat: geoloc.lat, lng: geoloc.lng }}
                onClick={() => handleOpenInfoWindow(idx)}
              >
                {isOpen.isOpen && isOpen.marker == idx ? (
                  <InfoWindow
                    options={{ overflow: 'hidden' }}
                    onCloseClick={() => handleOpenInfoWindow(idx)}
                  >
                    <Row>
                      <Col lg="8" xl="8">
                        <div>
                          <b style={{ color: element.service_color }}>
                            Protocolo:
                          </b>
                          <Link to={`/admin/solicitations/${element.id}`}>
                            {' ' + element.protocol}
                          </Link>
                        </div>
                        <div>
                          <b style={{ color: element.service_color }}>
                            Serviço:
                          </b>
                          {' ' + element.service_name}
                        </div>
                        <div>
                          <b style={{ color: element.service_color }}>
                            Categoria:
                          </b>
                          {' ' + element.category_name}
                        </div>
                      </Col>
                      <Col lg="4" xl="4">
                        <Media>
                          <img
                            src={
                              element.photo !== 'noImage'
                                ? 'http://192.168.0.23:8080/' + element.photo
                                : require('assets/img/theme/noImage.jpg')
                            }
                            alt={element.protocol}
                            style={{ width: 50, height: 50 }}
                          ></img>
                        </Media>
                      </Col>
                    </Row>
                  </InfoWindow>
                ) : (
                  <></>
                )}
              </Marker>
            )
          })
        ) : (
          <></>
        )}
      </GoogleMap>
    )
  })
)

const Maps = (props) => {
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <CardHeader className="border-0">
                <h3 id="title" className="mb-0">
                  {`Mapa das Solicitações - Total: ${totalSolicitations}`}
                </h3>
              </CardHeader>
              <CardFooter>
                <MapWrapper
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAOduKwOekIvIXRD8ISW0rNrGQ6mmvlFFk"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={
                    <div
                      style={{ height: `600px` }}
                      className="map-canvas"
                      id="map-canvas"
                    />
                  }
                  mapElement={
                    <div style={{ height: `100%`, borderRadius: 'inherit' }} />
                  }
                />
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default Maps
