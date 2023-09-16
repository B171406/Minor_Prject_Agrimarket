import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AddNewProduct.css";
import ErrorModal from "../UIElements/ErrorModal";
import SuccessModal from "../UIElements/SuccessModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { AuthContext } from "../context/auth-context";

const AddNewProduct = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    productname: "",
    author:"",
    price : "",
    description: "",
    images: "",
    email: "",
    phone: "",
    creator : ""
  });

  const onFormChangeHandler = (e) => {
    const { value, name, type, files } = e.target;
    setForm((state) => ({
      ...state,
      [name]: type === "file" ? files : value,
    }));
  };

  const addNewProductHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(form)
    formData.append("productname",form.productname);
    formData.append("author",form.author);
    formData.append("price",form.price);
    formData.append("description",form.description);
    formData.append("email",form.email);
    formData.append("phone",form.phone);
    formData.append("creator",form.creator);
    for (const file of form.images) {
      formData.append("images", file);
    }
    console.log(formData)
    const ok = true;
    if (ok){try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/products/addnewproduct",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const responseData = await response.json();
      console.log("Response Data : ", responseData);
      // console.log("test");
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      console.log("Error : ", err);
      setIsLoading(false);
      setError(err.message || "Error While Creating New Product");
    }
    console.log("end");}
  };

  const errorHandler = () => {
    setError(null);
  };

  const successHandler = () => {
    setSuccess(false);
    navigate("/");
  };

  return (
    <div id="addnewproduct_id">
      <ErrorModal error={error} onClear={errorHandler} />
      <SuccessModal
        success={success}
        successMessage="New Product Uploaded!"
        onClear={successHandler}
      />
      {isLoading && <LoadingSpinner asOverlay />}
      <form
        onSubmit={addNewProductHandler}
        id="addnewproduct"
        enctype="multipart/form-data"
      >
        <h3 id="head">New Listing</h3>
        <div id="Upload">
          <br></br>
          <span id="imgUpload">Product images:</span>
          <br></br>
          <br></br>
          <input
            type="file"
            className="file"
            accept=".jpg,.png,.jpeg"
            required
            name="images"
            onChange={onFormChangeHandler}
            multiple
          />
          <h5> Product Details:</h5>
          <hr style={{ color: "orange" }}></hr>
          <label>Product Name:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            name="productname"
            className="inputUpload"
            onChange={onFormChangeHandler}
            placeholder="Enter Titile"
            required
          />
          <br></br>
          <br></br>
          <div id="flex_div">
            
          
          </div>
          
          
          <label>Price:</label>
          <br></br>
          <br></br>
          <input
            type="number"
            className="inputUpload"
            name="price"
            onChange={onFormChangeHandler}
            placeholder="Enter Price for Quintal"
            required
          />
          <br></br>
          <br></br>
          <label>Farmer:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            className="inputUpload"
            name="author"
            onChange={onFormChangeHandler}
            placeholder="Farmer"
            required
          />

          <br></br>
          <br></br>
          <br></br>
          <label>Product Description:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            className="inputUpload"
            name="description"
            onChange={onFormChangeHandler}
            placeholder="Enter Description "
            required
          />
          <br></br>
          <br></br>
          <br></br>
          <h5>Contact:</h5>
          <hr style={{ color: "orange" }}></hr>
          <label>E-mail:</label>
          <br></br>
          <br></br>
          <input
            type="email"
            className="inputUpload"
            name="email"
            onChange={onFormChangeHandler}
            placeholder="email@email.com"
            required
          />
          <br></br>
          <br></br>
          <label>Phone:</label>
          <br></br>
          <br></br>
          <input
            type="tel"
            className="inputUpload"
            name="phone"
            onChange={onFormChangeHandler}
            placeholder="Enter Phone Number"
            required
          />
          <br></br>
          <br></br>
          <button className="SubmitUpload">Submit</button>
          <br></br>
          <br></br>
        </div>
      </form>
    </div>
  );
};

export default AddNewProduct;
