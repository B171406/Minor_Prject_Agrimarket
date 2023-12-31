import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth-context";

import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";
import SuccessModal from "../UIElements/SuccessModal";

import ImageSlider from "../ImageComponents/ImageSlider";

import "./ProductDetails.css";


const ProductDetails = () => {

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  console.log(auth)
  const { productId } = useParams("productId");
  console.log("In product details >Product Id >>>", productId);
  const [loadedProduct, setLoadedProduct] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/products/${productId}`
        );
        const responseData = await response.json();
        console.log("Response Data >>>", responseData);
        if (responseData.status === "fail" || responseData.status === "error") {
          throw new Error("Given product ID Is Not valid");
        }
        console.log(
          "In ProductDetials >Response Data.data >>>",
          responseData.data
        );
        setLoadedProduct(responseData.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Error While getting product Details By Id");
        console.log("Error While getting product Details By Id");
      }
    };
    getProductDetails();
  }, [productId]);

  const deleteProductHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const responseData = await response.json();
      console.log("in product details response data >>>", responseData);
      if (responseData.status === "fail" || responseData.status === "error") {
        throw new Error(responseData.message || "Error While Deleting product");
      }
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Error While Deleting product");
    }
  };

  const updateClickHandler = () => {
    navigate(`/updateproduct/${productId}`);
  };
  const errorHandler = () => {
    setError(null);
  };

  const successHandler = () => {
    setSuccess(false);
    navigate("/myproducts");
  };
  const containerStyles = {
    width: "500px",
    height: "280px",
    margin: "0 auto",
  };

  return (
    <div id="product_details_page">
      <div className="productdetails-header"><h1>Product and Farmer Details</h1></div>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      <SuccessModal
        success={success}
        successMessage="Product Deleted Successfully!"
        onClear={successHandler}
      />
      {!isLoading && loadedProduct && (
        <div id="product_details">
          <div className="product_header">
            <h1>{loadedProduct.title}</h1>
          </div>
          <div class="image_slider">
            <div style={containerStyles}>
              <ImageSlider
                slides={loadedProduct.images}
                prePath={`${process.env.REACT_APP_ASSET_URL}/img/products`}
              />
            </div>
          </div>
          {/* <ul style={{ borderTop: "2px solid green", marginTop: "30px" }}> */}
          <ul className="details-background">
            <li>
              <h4>Product Information : </h4>
              <div className="listing_information">
                <div className="address">
                  <span>Farmer :</span>
                  <br></br>
                  <span className="answer">
                    {loadedProduct.author}
                  </span>
                </div>
                <br></br>

                <br></br>
                <div>
                  <label>Price :</label>
                  <span className="answer">
                    {"   ₹"}
                    {loadedProduct.price}
                    {"/Quintal"}
                  </span>
                </div>
                <br></br>

                <br></br>
                <div className="listing_description">
                  Description :
                  <span className="answer">{loadedProduct.description}</span>
                </div>
              </div>
            </li>
            <li>
              <h4>Contact Information : </h4>
              <div className="listing_contact">
                <label>
                  Phone <i class="fa fa-phone" aria-hidden="true"></i> :{" "}
                  <span className="answer">{loadedProduct.phone}</span>
                </label>
                <br></br>
                <br></br>

                <label>
                  E-mail <i class="fa fa-envelope" aria-hidden="true"></i> :{" "}
                  <span className="answer">{loadedProduct.email} </span>
                </label>
                <br></br>
                <br></br>

              </div>
            </li>
            {(auth.userId === loadedProduct.creator || auth.admin) && (
              <li>
                <h4>Edit | Delete: </h4>

                <div className="owner_edit_delete">
                  <button onClick={updateClickHandler}>
                    Edit <i class="fa fa-edit"></i>
                  </button>
                  <br></br>
                  <br></br>
                  <button onClick={deleteProductHandler}>
                    {" "}
                    Delete <i class="fas fa-trash"></i>
                  </button>
                </div>
              </li>
            )}
          </ul>
          {(auth.userId !== loadedProduct.creater) && (
            <div>
              <button class="buy-button">
                {" "}
                Buy <i class="fas fa-shopping-cart"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProductDetails;

<span></span>;