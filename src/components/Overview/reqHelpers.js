import axios from 'axios'
const token = process.env.API_KEY

const headers = {
  'Authorization': token
}


let getProductById = (id) => {
  return axios.get(`http://73.112.222.190:3000/products/${id}/styles`, { headers })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

let getInfoById = (id) => {
  return axios.get(`http://73.112.222.190:3000/products/${id}`, { headers })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

let getRatingById = (id) => {
  return axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/?product_id=${id}`, { headers })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export default {getProductById, getInfoById, getRatingById}