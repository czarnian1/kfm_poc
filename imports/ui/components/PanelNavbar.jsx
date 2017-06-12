import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import AccountsUIWrapper from '../../ui/components/AccountsUIWrapper.jsx';

import { Session } from 'meteor/session'

import createObjectForExport from '../classes/createObjectForExport.jsx';

import CF, {LocationTitles, LocationIcons, ShippingStatuses} from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup

// Navbar of the application
export default class PanelNavbar extends Component {

    onClickProductionStatusOneHour(e){
        var now=new Date();
        Session.set("productionStatus", {"$gte" : new Date(now.getTime()-3600*1000)} );
    }
    
    onClickProductionStatusOverdue(e){
        Session.set("productionStatus", {"$gte" : new Date(1)} );
    }
    
    onClickExportCsv(ev){
        var ofe= new createObjectForExport();
        document.getElementById("exportCsv").href = window.URL.createObjectURL(  ofe.createBlobCsv(Session.get("productionStatus"))  );
    }
    
    onClickExportJson(ev){
        var ofe= new createObjectForExport();
        document.getElementById("exportJson").href = window.URL.createObjectURL(  ofe.createBlobJson(Session.get("productionStatus"))  );
    }

    setLocale(locale){
        i18n.setLocale(locale);
        accountsUIBootstrap3.setLanguage(locale);

        Meteor.users.update(
            {"_id":Meteor.userId()},
            {$set:{
                "profile.defaultLocale":i18n.getLocale(),
            }}
        );
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
//    console.log("PanelNavbar:render");
    
    return(
      <nav className="navbar navbar-default" role="navigation" id="render-application-navbar">
            
        <div className="navbar-header">
           
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#gnavi">
             <span className="sr-only"><T>ui.navbar.ToggleNavigation</T></span>
             <span className="icon-bar"></span>
             <span className="icon-bar"></span>
             <span className="icon-bar"></span>
          </button> <a href="#" className="navbar-brand"><img style={{width: "25%"}} src="/assets/Kubota_logo_400px.png"/></a>
        </div>
        
        <div className="collapse navbar-collapse" id="gnavi">
             
          <ul className="nav navbar-nav">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown"><T>ui.navbar.ProductionStatus</T><strong className="caret"></strong></a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#" onClick={this.onClickProductionStatusOneHour}><T>ui.navbar.OneoHour</T></a>
                </li>
                <li>
                  <a href="#" onClick={this.onClickProductionStatusOverdue}><T>ui.navbar.Overdue</T></a>
                </li>

                <li className="divider"></li>

                <li className="dropdown-header"><T>ui.navbar.DataExport</T></li>
                <li>
                <a id="exportCsv" href="" download={"PM "+(new Date()).toString()+".csv"} onClick={this.onClickExportCsv}><T>ui.navbar.Csv</T></a>
                </li>
                <li>
                  <a id="exportJson" href="" download={"PM "+(new Date()).toString()+".json"} onClick={this.onClickExportJson}><T>ui.navbar.Json</T></a>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="nav navbar-nav navbar-right">
           {
                 cf.AllowSelfRegistration() ?  <li><a href="#"><AccountsUIWrapper /></a></li>
                 : <li><h4 style={{margin:'15px'}}><label id="displayUsername" className="label label-success"></label></h4></li>
           }
                  
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown"><T>ui.navbar.Admin</T><strong className="caret"></strong></a>
              <ul className="dropdown-menu">
                <li className="dropdown-header"><T>ui.navbar.ChangeLanguage</T></li>
                <li>
                  <a href="#" onClick={ ()=>{this.setLocale('en');} }>English</a>
                </li>
                  <li>
                  <a href="#" onClick={ ()=>{this.setLocale('fr');} }>Français</a>
                </li>
                <li>
                  <a href="#" onClick={ ()=>{this.setLocale('ja');} }>日本語</a>
                </li>

                <li className="divider"></li>
                <li id="LiManageUsers">
                  <a href="/ManageUsers"><T>ui.manageAccount.ManageUsers</T></a>
                </li>
                  
                <li className="divider"></li>
                <li id="LiManageAccount">
                  <a href={"/ManageAccount/"+Meteor.userId()}><T>ui.manageAccount.ManageAccount</T></a>
                </li>
                  
                <li className="divider"></li>
                <li>
                  <a href="/Login" onClick={this.onClickLogout}><T>ui.navbar.Logout</T></a>
                </li>
              </ul>
            </li>
                  
          </ul>
        </div>
      </nav>
      );
  };

  componentDidMount(){
//      console.log("panelNavbar:componentDidMount");
      Tracker.autorun(()=>{
          if(Meteor.user()==undefined)  return;
          
          $('#displayUsername').html(Meteor.user().username);
          
          if( cf.Role(Meteor.user()).AdminScreen ){
              $('#LiManageUsers').css('pointer-events', 'auto');
              $('#LiManageUsers').css('opacity', 1.0);
          }
          else{
              $('#LiManageUsers').css('pointer-events', 'none');
              $('#LiManageUsers').css('opacity', 0.4);
          }
          
          $("#LiManageAccount a").attr("href", '/ManageAccount/'+Meteor.userId());
      });
  }
  
}
