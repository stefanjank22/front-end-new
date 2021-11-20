import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap'
import 'jquery/dist/jquery'
import 'popper.js/dist/popper'
import {HashRouter, Route, Switch} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import {ContactPage} from "./components/ContactPage/ContactPage";
import {UserLoginPage} from "./components/UserLoginPage/UserLoginPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import {UserRegistrationPage} from "./components/UserRegistrationPage/UserRegistrationPage";
import OrderPage from "./components/OrderPage/OrderPage";
import {AdministratorLoginPage} from "./components/AdministratorLoginPage/AdministratorLoginPage";
import AdministratorDashboard from "./components/AdministratorDashboard/AdministratorDashboard";


ReactDOM.render(
  <React.StrictMode>
      <HashRouter>
          <Switch>
              <Route exact path={"/"} component={HomePage}/>
              <Route path={"/contact"} component={ContactPage}/>
              <Route path={"/user/login"} component={UserLoginPage}/>
              <Route path={"/user/register"} component={UserRegistrationPage}/>
              <Route path={"/category/:cId"} component={CategoryPage}/>
              <Route path={"/user/orders"} component={OrderPage}/>
              <Route path={"/administrator/login"} component={AdministratorLoginPage}/>
              <Route path={"/administrator/dashboard"} component={AdministratorDashboard}/>
          </Switch>
      </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
