import React from 'react'
import Index from 'views/Index.js'
import Profile from 'views/examples/Profile.js'
import Maps from 'views/examples/Maps.js'
import Login from 'views/examples/Login.js'
import Solicitations from 'components/Solicitations/Solicitations'
import Services from 'components/Services/Services'
import SolicitationIntern from 'components/Solicitations/SolicitationIntern'
import ServicesIntern from 'components/Services/ServicesIntern'

const solicitations = {
  title: 'Solicitações',
  header: ['Protocolo', 'Secretaria', 'Status', 'Usuário', 'Data'],
}

const services = {
  title: 'Secretarias',
  header: ['Nome', 'Cor', 'Ativo', 'Icone', 'Data'],
}

var routes = [
  {
    path: '/index',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-primary',
    component: Index,
    layout: '/admin',
  },
  {
    path: '/services',
    name: 'Secretarias',
    icon: 'ni ni-building text-primary',
    component: (props) => <Services {...props} data={services} />,
    layout: '/admin',
  },
  {
    path: '/services/:id',
    name: 'Secretarias',
    icon: 'ni ni-building text-primary',
    component: (props) => <ServicesIntern {...props} />,
    layout: '/admin',
  },
  {
    path: '/solicitations',
    name: 'Solicitações',
    icon: 'ni ni-bullet-list-67 text-primary',
    component: (props) => <Solicitations {...props} data={solicitations} />,
    layout: '/admin',
  },
  {
    path: '/solicitations/:id',
    name: 'Solicitação',
    icon: 'ni ni-bullet-list-67 text-primary',
    component: (props) => <SolicitationIntern {...props} />,
    layout: '/admin',
  },
  {
    path: '/maps',
    name: 'Mapa de Solicitações',
    icon: 'ni ni-pin-3 text-primary',
    component: Maps,
    layout: '/admin',
  },
  {
    path: '/user-profile',
    name: 'Perfil',
    icon: 'ni ni-single-02 text-primary',
    component: Profile,
    layout: '/admin',
  },
  {
    path: '/login',
    name: 'Login',
    icon: 'ni ni-key-25 text-primary',
    component: Login,
    layout: '/auth',
  },
]
export default routes
