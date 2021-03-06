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
import AdministratorDashboardCategory from "./components/AdministratorDashboardCategory/AdministratorDashboardCategory";
import AdministratorDashboard from "./components/AdministratorDashboard/AdministratorDashboard";
import AdministratorDashboardFeature from "./components/AdministratorDashboardFeature/AdministratorDashboardFeature";
import AdministratorDashboardArticle from "./components/AdministratorDashboardArticle/AdministratorDashboardArticle";
import AdministratorDashboardPhoto from "./components/AdministratorDashboardPhoto/AdministratorDashboardPhoto";
import ArticlePage from "./components/ArticlePage/ArticlePage";
import AdministratorDashboardOrder from "./components/AdministratorDashboardOrder/AdministratorDashboardOrder";
import {AdministratorLogoutPage} from "./components/AdministratorLogoutPage/AdministratorLogoutPage";
import {UserLogoutPage} from "./components/UserLogoutPage/UserLogoutPage";


ReactDOM.render(
  <React.StrictMode>
      <HashRouter>
          <Switch>
              <Route exact path={"/"} component={HomePage}/>
              <Route path={"/contact"} component={ContactPage}/>
              <Route path={"/user/login"} component={UserLoginPage}/>
              <Route path={"/user/logout"} component={UserLogoutPage}/>
              <Route path={"/user/register"} component={UserRegistrationPage}/>
              <Route path={"/category/:cId"} component={CategoryPage}/>
              <Route path={"/article/:aId"} component={ArticlePage}/>
              <Route path={"/user/orders"} component={OrderPage}/>
              <Route path={"/administrator/login"} component={AdministratorLoginPage}/>
              <Route path={"/administrator/logout"} component={AdministratorLogoutPage}/>
              <Route exact path={"/administrator/dashboard"} component={AdministratorDashboard}/>
              <Route path={"/administrator/dashboard/category"} component={AdministratorDashboardCategory}/>
              <Route path={"/administrator/dashboard/feature/:cId"} component={AdministratorDashboardFeature}/>
              <Route path={"/administrator/dashboard/article"} component={AdministratorDashboardArticle}/>
              <Route path={"/administrator/dashboard/photo/:aId"} component={AdministratorDashboardPhoto}/>
              <Route path={"/administrator/dashboard/order"} component={AdministratorDashboardOrder}/>


          </Switch>
      </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
