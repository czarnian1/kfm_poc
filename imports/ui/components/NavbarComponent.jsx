/*

Active Code : 

*/

import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';

const T = i18n.createComponent(); // translater component for json lookup

// Navbar of the application
export class NavbarComponent extends Component {

  render() {
    console.log("NavbarComponent:render");
    //return the html for Navbar in Application
    return(
     <nav className="navbar navbar-default" role="navigation" id="render-application-navbar">
        <div className="navbar-header">
           
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
             <span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span>
          </button> <a href="#" className="navbar-brand"><img style={{width: "25%"}} src="assets/Kubota_logo_400px.png"/></a>
        </div>
        
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            
            <li className="dropdown">
               <a href="#" className="dropdown-toggle" data-toggle="dropdown"><T>common.navbar.productionstatus</T><strong className="caret"></strong></a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#"><T>1 Hour</T></a>
                </li>
                <li>
                  <a href="#"><T>Overdue</T></a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown"><T>common.navbar.admin</T><strong className="caret"></strong></a>
              <ul className="dropdown-menu">
                <li>
                  <button className="btn-link dropdown-toggle" type="button" id="setLanguage" data-toggle="dropdown"></button>
                  <a href="#"><T>common.navbar.changelanguage</T></a>
                </li>
                <li className="divider">
                </li>
                <li><a href="/logout"><T>Logout</T></a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      );
  };
}

export default NavbarComponent;
