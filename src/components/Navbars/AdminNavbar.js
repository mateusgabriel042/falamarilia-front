import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from 'reactstrap'
// import { toast } from 'react-toastify'

import api from '../../services/api'

const AdminNavbar = (props, { history }) => {
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
            // toast.error('Houve um problema ao carregar o perfil.')
          })
      } catch (_err) {
        // toast.error('Houve um problema ao carregar o perfil.')
      }
    }

    loadToken()
    loadProfile()
  }, [userData])

  const handleLogout = async () => {
    localStorage.removeItem('@user_data')
    history.push('/auth/login')
  }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require('assets/img/theme/avatar.png')}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {profile.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">CPF: {profile.cpf}</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>Perfil</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#octo" onClick={() => handleLogout()}>
                  <i className="ni ni-user-run" />
                  <span>Sair</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default AdminNavbar
