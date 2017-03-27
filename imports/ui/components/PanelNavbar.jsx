import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';

import { Session } from 'meteor/session'

const T = i18n.createComponent(); // translater component for json lookup

// Navbar of the application
export class PanelNavbar extends Component {

    onClickProductionStatusOneHour(e){
        var now=new Date();
        Session.set("productionStatus", {"$gte" : new Date(now.getTime()-3600*1000)} );
    }
    
    onClickProductionStatusOverdue(e){
        Session.set("productionStatus", {"$gte" : new Date(1)} );
    }
    
    onClickLogout(p){
        console.log("PanelNavbar:onClickLogout");
        Meteor.logout(
            function(e){
                if(e) {
                    console.log(e);
                }
                else {
                    console.log("Logged out!");
                } 
            }
        );

    };   

  render() {
    console.log("PanelNavbar:render");

    return(
     <nav className="navbar navbar-default" role="navigation" id="render-application-navbar">
        <div className="navbar-header">
           
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
             <span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span>
          </button> <a href="#" className="navbar-brand"><img style={{width: "25%"}} src="/assets/Kubota_logo_400px.png"/></a>
        </div>
        
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            
            <li className="dropdown">
               <a href="#" className="dropdown-toggle" data-toggle="dropdown"><T>common.navbar.productionstatus</T><strong className="caret"></strong></a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#" onClick={this.onClickProductionStatusOneHour}><T>1 Hour</T></a>
                </li>
                <li>
                  <a href="#" onClick={this.onClickProductionStatusOverdue}><T>Overdue</T></a>
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
                <li>
                  <a href="/login" onClick={this.onClickLogout}><T>Logout</T></a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      );
  };
}

export default PanelNavbar;
