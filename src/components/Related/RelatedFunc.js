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

let getInfoByIdRelated = (id) => {
  return axios.get(`http://73.112.222.190:3000/products/${id}/related`, { headers })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

let getInfoByIdRating = (id) => {
  return axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/meta?product_id=${id}`, { headers })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}


let loadCarousel = (id) => {
  var styles = []
  var products = []
  var ratings = []

  let getInfoByIdRelated = (id) => {
    return axios.get(`http://73.112.222.190:3000/products/${id}/related`, { headers })
      .then((response) => {
        // console.log('related request', response.data)
        for (var i = 0; i<response.data.length;i++) {

          styles.push(getProductById(response.data[i]))

          products.push(getInfoById(response.data[i]))

          ratings.push(getInfoByIdRating(response.data[i]))

        }
        return Promise.all([Promise.all(styles), Promise.all(products), Promise.all(ratings)])
      })
      .then((result) => {
        return result;
        // console.log(result, 'result')
      })
      .catch(err => {
        console.log(err)
      })
  }

  return getInfoByIdRelated(id)

}

export default loadCarousel;