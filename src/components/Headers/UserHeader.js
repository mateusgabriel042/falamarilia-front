import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'

import { toast } from 'react-toastify'

import api from '../../services/api'

const UserHeader = () => {
  const [profile, setProfile] = useState('')
  const [userData, setUserData] = useState('')

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
              setProfile(res.data)
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

  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: '400px',
          backgroundImage:
            'url(' + require('assets/img/theme/bg-cover.jpg') + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="12" md="12">
              <h1 className="display-2 text-white">Olá, {profile.name}</h1>
              <p className="text-white mt-0 mb-5">
                Este é o seu perfil, aqui você pode visualizar e editar os seus
                dados...
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default UserHeader
