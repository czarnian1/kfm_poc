/*

Active Code : 

This component doesn't display Productiontasks but will filters on the relevant collections

*/

import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Productiontasks } from '../../api/productiontasks.js';

import Productiontask from '../../ui/components/Productiontask.jsx';

const T = i18n.createComponent(); // translater component for json lookup

const filter_ul_style = {
  'list-style': 'none'
}

// Filterpanel component - represents the Filter Panel Component in the DOM
class Filterpanel extends Component {

  renderTasks() {
    console.log("Filter");
    console.log(Meteor.userId());

    if (!Meteor.user()) {
      return(
        <div><T>common.main.notloggedin</T></div>
        );
    } else
    {
    //return the html for filter panel
    return(
    <div>
          <div className="panel-heading kubota-panel-bg" id="render-filter-panel">
            <h3 className="panel-title">
              <T>common.filter.utilities</T>
            </h3>
          </div>
          <div className="panel-body table-responsive">
            <form role="form search">
              <div className="form-group">
                <label htmlFor="tractorIDInputText">
                  <T>common.filter.tractorid</T>
                </label>
                <input type="text" className="form-control" id="tractorSearchText" />
              </div>  
            <div className="form-group">
              <div className="checkbox">
                <fieldset>
                  <ul style={filter_ul_style}>
                    <li>
                    <label>
                    <input type="checkbox" /><T>common.filter.japan</T>
                    </label>
                    </li>
                    <li>
                    <label>
                    <input type="checkbox" /><T>common.filter.europe</T>
                    </label>
                    </li>
                    <li>
                    <label>
                    <input type="checkbox" /><T>common.filter.usa</T>
                    </label>
                    </li>
                    <li>
                    <label>
                    <input type="checkbox" /><T>common.filter.australia</T>
                    </label>
                    </li>
                    <li>
                    <label>
                    <input type="checkbox" /><T>common.filter.unitedkingdom</T>
                    </label>
                    </li>
                  </ul>
                </fieldset>
              </div> 
              <button type="submit" className="btn btn-default">
                <T>common.main.buttonfilter</T>
              </button>
            </div>
          </form>
        </div>
      </div>
        );
  } //end else user logged in check
};

  render(){
    return (
        <span>{this.renderTasks()} </span>
    );
  }
}

Filterpanel.propTypes = {
  productiontasks: PropTypes.object.isRequired,
  chassiscount: PropTypes.number,
};

export default createContainer(() => {
  return {
    productiontasks: Productiontasks.find(),
    chassiscount: Productiontasks.find().count(),
  };
}, Filterpanel);
