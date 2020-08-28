import api from '../services/api'

const authenticated = async () => {
  const userData = localStorage.getItem('@user_data')
  const userToken = JSON.parse(userData)

  if (userToken) {
    return api
      .get('/authenticated', {
        headers: {
          Authorization: 'Bearer ' + userToken.token,
        },
      })
      .then((res) => {
        const data = res.data
        const message = data.message ?? ''

        if (message === 'Authenticated.') {
          return true
        } else if (message === 'Unauthenticated.') {
          return false
        }
      })
      .catch((err) => {
        console.log(err.response)
        localStorage.clear()
        return false
      })
  }

  // return false
}

export default authenticated
