/*

Active Code : 

*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';


class LoginObject extends Component {

    onClickLogin(p){
        console.log("LoginObject:onClickLogin");
        Meteor.loginWithPassword(
            document.getElementById("loginUsername").value,
            document.getElementById("loginPassword").value,
            function(e){
                if(e) {
                    console.log(e);
                } else {
                    console.log("logged in");
                } 
            }
        );
    };   

    render() {
      console.log("LoginObject:render");
      return (
          <div>

<div className="col-md-4" style={{height:"100%", "vertical-align": "middle"}}></div>
<div className="col-md-4 center-block" >
              <h3>Login</h3>
              <form class="form-horizontal">
                  <div class="form-group">
                      <div class="col-sm-10">
                          <input type="test" class="form-control" id="loginUsername" placeholder="Username"/>
                      </div>
                  </div>
                  <br />
                  <div class="form-group">
                      <div class="col-sm-10">
                          <input type="password" class="form-control" id="loginPassword" placeholder="Password" />
                      </div>
                  </div>
                  <br />
                  <div class="form-group">
                      <div class="col-sm-offset-2 col-sm-10">
                          <button type="submit" class="btn btn-default" onClick={this.onClickLogin} >Login</button>
                      </div>
                  </div>
              </form>
</div>
          </div>
      )
    }
}

export const LoginComponent = ( ) => (
    <div>
        <LoginObject />
    </div>
);

  

