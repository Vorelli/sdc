import axios from 'axios'
const token = process.env.API_KEY

const headers = {
  'Authorization': token
}


let getProductById = (id) => {
  return axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/products/${id}/styles`, { headers })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export default getProductById;