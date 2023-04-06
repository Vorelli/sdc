import React from 'react';
import {AiFillStar} from 'react-icons/ai'
import './Related.css';
import Modal from './Related-Modal'
import RelatedCompare from './Related-Card-Compare'
import {useSelector} from 'react-redux'
import axios from 'axios'
import selectedProductSlice from '../../reducers/selectedProductSlice'
import { useDispatch } from 'react-redux';
import loadCarousel from './RelatedFunc.js'
import RatingView from '../sharedComponents/RatingView'


const RelatedCard = ({products}) => {

  const selectedProduct = useSelector((state) => state.selectedProductReducer.selectedProduct)

  const token = process.env.API_KEY

  const headers = {
    'Authorization': token
  }

  const dispatch = useDispatch();

    let getProductById = (id) => {
      return axios.get(`http://73.112.222.190:3000/products/${id}`, { headers })
        .then(response => {
          return response.data
        })
        .catch(err => {
          console.log(err)
        })
    }
    // console.log("getProductById", getProductById )

if (products.results[0].sale_price) {
  return (
    <div className="relative">
        <input type="checkbox" id={products.product_id} className="modal-toggle" />
<label id={products.product_id} htmlFor={products.product_id} className="modal cursor-pointer">
  <label id={products.product_id} className="modal-box relative max-w-7xl w-full">
    <RelatedCompare compare={products} />
  </label>
</label>
      <div className="carousel-item container w-[250px]" >
    <div id={products.product_id} className="card card1 w-[250px] card-bordered rounded border-grey">
    <label id='compareBtn' htmlFor={products.product_id} className="btn" >☆</label>
  <figure id='cardImgContainter'><img className='cardImg' src={products.results[0].photos[0].thumbnail_url
 ||"https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6" } /></figure>
  <div className="card-body hover:cursor-pointer" id={products.product_id} onClick={
      ()=>getProductById(products.product_id)
      .then((response)=> {
        // console.log('then response after reqqq',response)
        dispatch(selectedProductSlice.actions.selectedProductRequestSuccess(response))
      })}>
  <small>{products.extra.category || " "}</small>
    <h2 id="titleCard" className="card-title">{products.extra.name}</h2>
    <small style={{textDecoration: 'line-through'}}>{products.extra.default_price}</small>
    <small style={{color:'red'}}>{products.results[0].sale_price}</small>
    <div id='relatedRating'>
    <RatingView width={108} rating={products.ratings}/>
    </div>
    <div className="card-actions justify-end">
    <small></small>
    </div>
  </div>
</div>
</div>
</div>
  );


    } else {
      return (
        <div className="relative">
            <input type="checkbox" id={products.product_id} className="modal-toggle" />
    <label id={products.product_id} htmlFor={products.product_id} className="modal cursor-pointer">
      <label id={products.product_id} className="modal-box relative max-w-2xl w-full">
        <RelatedCompare compare={products} />
      </label>
    </label>
          <div className="carousel-item container w-[250px]">
        <div id={products.product_id} className="card card1 w-[250px] card-bordered rounded border-grey">
        <label id='compareBtn' htmlFor={products.product_id} className="btn" module={"relatedCardCompare " + products.product_id + "|related"}>☆</label>
      <figure id='cardImgContainter' module={"relatedCardImg " + products.product_id + "|related"}><img className='cardImg' src={products.results[0].photos[0].thumbnail_url
     ||"https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6" }/></figure>
      <div className="card-body hover:cursor-pointer" id={products.product_id} onClick={
          ()=>getProductById(products.product_id)
          .then((response)=> {
            // console.log('then response after req',response)
            dispatch(selectedProductSlice.actions.selectedProductRequestSuccess(response))
          })} module={"relatedCardBody " + products.product_id + "|related"}>
      <small>{products.extra.category || " "}</small>
        <h2 id="titleCard" className="card-title">{products.extra.name}</h2>
        <small>{products.extra.default_price}</small>
        <div id='relatedRating'>
        <RatingView width={108} rating={products.ratings}/>
        </div>
        <div className="card-actions justify-end">
        <small id='ratingCount'>{products.count}</small>
        </div>
      </div>
    </div>
    </div>
    </div>
      );

    }
}

export default RelatedCard

