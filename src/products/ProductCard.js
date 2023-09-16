import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
const ProductCard = (props) => {
  const navigate = useNavigate();
  // console.log("in product card props.id >>>> ", props.id);
  const getDetailsHandler = () => {
    navigate(`/productdetails/${props.id}`);
  };
  return (
    <li style={{ padding: "20px 20px" }}>
      <div id="container">
        <div class="card">
          <img
            src={`${process.env.REACT_APP_ASSET_URL}/img/products/${props.images[0]}`}
            alt={`${props.images[0]}`}
          />
          <div class="card__details">
            {/* <span class="tag">{props.product_type}</span> */}

            <div class="name">{props.productname} </div>

            
            <span style={{ fontSize: "20px", color: "black" }}>
              ₹{props.price}
            </span>
            <span style={{ color: "darkgrey" }}>/Quintal</span>

            
            <button style={{ marginTop: "30px" }} onClick={getDetailsHandler}>
              Product Details
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
export default ProductCard;
