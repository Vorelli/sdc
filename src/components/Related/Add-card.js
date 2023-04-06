
import React, {useEffect, useState} from 'react';
import {AiFillStar} from 'react-icons/ai'
import './Related.css';
import {useSelector,useDispatch} from 'react-redux'
import axios from 'axios'
import selectedProductSlice from '../../reducers/selectedProductSlice'


const AddCard = () => {

  const selectedProduct = useSelector((state) => state.selectedProductReducer.selectedProduct)

  const rating = useSelector((state) => state.ratingsReviewsReducer.meta.averageReviews)
  const { meta, sorting, ratingsReviews } = useSelector(
    (state) => state.ratingsReviewsReducer
  );
  const numReviews = useSelector((state) => state.ratingsReviewsReducer.meta.numReviews)

  const [addImage, setAddImage] = useState('https://images.unsplash.com/photo-1514866726862-0f081731e63f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80');

  const [styles, setStyles] = useState({})

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

  const dispatch = useDispatch();



  useEffect(() => {
    // console.log('USEFFECT IS WORKING')
    getProductById(selectedProduct.id)
    .then((res) => {
      // console.log(res,'RESULTS IN ADD')
      setStyles(res)
      setAddImage(res.results[0].photos[0].thumbnail_url)
    })

  }, [selectedProduct]);


  let addToOutfit = () => {
    var curr = {}

    curr.id = selectedProduct.id
    curr.name = selectedProduct.name
    curr.category = selectedProduct.category
    curr.price = selectedProduct.default_price
    curr.discountPrice = styles.results[0].sale_price
    curr.photo = styles.results[0].photos[0].thumbnail_url
    curr.rating = rating
    curr.numReviews = numReviews

    var string = JSON.stringify(curr)

    dispatch(selectedProductSlice.actions.yourOutfitLoadRequestSuccess(curr))
    localStorage.setItem(`${selectedProduct.id}`, string)
    console.log("item has been added to local storage")


  }








  return (
    <div className="relative">
    <div className="carousel-item container w-[220px]">
    <div id="addCard" className="card w-96 bg-base-100 shadow-xl image-full rounded border-grey" module={"addCard " + selectedProduct.id + "|related"}>
  <figure><img className='w-full' src={addImage || "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6" } /></figure>
  <div className="card-body">
  <label onClick={() => addToOutfit()} id='plus' className="btn">+</label>
    <div className="card-actions justify-end">
    </div>
  </div>
</div>
</div>
</div>

  );
}

export default AddCard
