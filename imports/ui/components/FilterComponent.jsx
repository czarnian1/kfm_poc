/*

Active Code : 

This component doesn't display Productiontasks but will filters on the relevant collections

*/

import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'

const T = i18n.createComponent(); // translater component for json lookup

const filter_ul_style = {
  'list-style': 'none'
}

// Filter component - represents the Filter Panel Component in the DOM
export class FilterComponent extends Component {
  onClickUpdate(){
      var f=[];

      if(document.getElementById('filterEndRegion_UK').checked) f[f.length]="UK";
      if(document.getElementById('filterEndRegion_EUR').checked) f[f.length]="EUR";
      if(document.getElementById('filterEndRegion_USA').checked) f[f.length]="USA";
      if(document.getElementById('filterEndRegion_JAPAN').checked) f[f.length]="JAPAN";
      Session.set("filterENDREGION", {$in:f})
  }
   
  render(){
    return (
        <span>
            <div>
            <div className="panel-heading kubota-panel-bg" id="render-filter-panel">
              <h3 className="panel-title">
                <T>Filter</T>
              </h3>
            </div>
            <div className="panel-body table-responsive">
              <form role="form search">
                <div className="form-group">
                  <label htmlFor="tractorIDInputText">
                    <T>Tractor ID</T>
                  </label>
                  <input type="text" className="form-control" id="tractorSearchText" />
                </div>  
              <div className="form-group">
                <div className="checkbox">
                  <fieldset>
                    <ul style={filter_ul_style}>
                      <li>
                      <label>
                      <input type="checkbox" id="filterEndRegion_UK" onClick={this.onClickUpdate}  /><T>UK</T>
                      </label>
                      </li>
                      <li>
                      <label>
                      <input type="checkbox" id="filterEndRegion_EUR" onClick={this.onClickUpdate} /><T>Europe</T>
                      </label>
                      </li>
                      <li>
                      <label>
                      <input type="checkbox" id="filterEndRegion_USA" onClick={this.onClickUpdate} /><T>USA</T>
                      </label>
                      </li>
                      <li>
                      <label>
                      <input type="checkbox" id="filterEndRegion_JAPAN" onClick={this.onClickUpdate} /><T>Japan</T>
                      </label>
                      </li>
                    </ul>
                  </fieldset>
                </div> 
              </div>
            </form>
          </div>
        </div>
            </span>
    );
  }
  
  componentDidMount() {
      document.getElementById('filterEndRegion_UK').checked=true;
      document.getElementById('filterEndRegion_EUR').checked=true;
      document.getElementById('filterEndRegion_USA').checked=true;
      document.getElementById('filterEndRegion_JAPAN').checked=true;
      this.onClickUpdate();
  }
    
}

