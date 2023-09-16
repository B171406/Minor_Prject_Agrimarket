import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import MainNavigation from "./Navigation/MainNavigation";

import Home from "./Home";
import Footer from "./Footer";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import About from "./Pages/About";
import ContactUs from "./Pages/ContactUs";
import AddNewProduct from "./products/AddNewProduct";


import MyAccount from "./Pages/MyAccount";


import { AuthContext } from "./context/auth-context";
import MyProducts from "./products/MyProducts";

import ProductCard from "./products/ProductCard";
import UpdateProduct from "./products/UpdateProduct";
import ProductDetails from "./products/ProductDetails";

import UpdatePassword from "./Pages/UpdatePassword";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AllProducts from "./products/AllProducts";

let logoutTimer;

function App() {
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [admin, setAdmin] = useState(null);


  const login = useCallback((uid, token, expirationDate, admin) => {
    
    setToken(token);
    setUserId(uid);
    setAdmin(admin)
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // one hour
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        admin: admin,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
    window.location.href= `${process.env.REACT_APP_FRONTEND_URL}`;
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
        storedData.admin
      );
    }
  }, [login]);

  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />}/>
        <Route path="/about" element={<About />} />
        <Route path="/addnewproduct" element={<AddNewProduct />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/myproducts" element={<MyProducts/>}/>
        <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
        <Route path="/productdetails/:productId" element={<ProductDetails />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="*" element={<h1>Route Not Found</h1>} />
        <Route path="/allproducts" element={<AllProducts />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contactus" element={<ContactUs />} />
        
        <Route path="/testproductcard" element={<ProductCard />} />
        <Route path="/productdetails/:productId" element={<ProductDetails />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/allproducts" element={<AllProducts />} />
        <Route
          path="/"  element={<Home/>}/>
      </Routes>
      
    );
  }

  return (
    
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        admin: admin,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <nav id="mainnavigation">
          <MainNavigation />
        </nav>
        {routes}
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}
export default App;