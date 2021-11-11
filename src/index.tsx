import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap'
import 'jquery/dist/jquery'
import 'popper.js/dist/popper'
import {MainMenu, MainMenuItem} from "./components/MainMenu/MainMenu";
import {HashRouter, Route, Switch} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import {ContactPage} from "./components/ContactPage/ContactPage";
import {UserLoginPage} from "./components/UserLoginPage/UserLoginPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import {UserRegistrationPage} from "./components/UserRegistrationPage/UserRegistrationPage";

const menuItems=[
  new MainMenuItem("Home","/"),
  new MainMenuItem("Contact","/contact"),
  new MainMenuItem("Log in","/user/login"),
  new MainMenuItem("Register","/user/register"),

  new MainMenuItem("Cat 1","/category/1"),
  new MainMenuItem("Cat 3","/category/3"),
  new MainMenuItem("Cat 5","/category/5"),
];

ReactDOM.render(
  <React.StrictMode>
      <MainMenu items={menuItems}/>
      <HashRouter>
          <Switch>
              <Route exact path={"/"} component={HomePage}/>
              <Route path={"/contact"} component={ContactPage}/>
              <Route path={"/user/login"} component={UserLoginPage}/>
              <Route path={"/user/register"} component={UserRegistrationPage}/>
              <Route path={"/category/:cId"} component={CategoryPage}/>
          </Switch>
      </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
