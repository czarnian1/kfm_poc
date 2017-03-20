import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'

const T = i18n.createComponent(); // translater component for json lookup

const filter_ul_style = {
  'liststyle': 'none'
}

// Filter component - represents the Filter Panel Component in the DOM
export class FilterComponent extends Component {
  render(){
      var onClickUpdate=function(e){
          var f=[];

          if(document.getElementById('filterEndRegion_UK').checked) f[f.length]="UK";
          if(document.getElementById('filterEndRegion_EUR').checked) f[f.length]="EUR";
          if(document.getElementById('filterEndRegion_USA').checked) f[f.length]="USA";
          if(document.getElementById('filterEndRegion_JAPAN').checked) f[f.length]="JAPAN";
          Session.set("filterENDREGION", {$in:f})
      }
       
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
                      <input type="checkbox" id="filterEndRegion_UK" onClick={onClickUpdate}  /><T>UK</T>
                      </li>
                      <li>
                      <input type="checkbox" id="filterEndRegion_EUR" onClick={onClickUpdate} /><T>Europe</T>
                      </li>
                      <li>
                      <input type="checkbox" id="filterEndRegion_USA" onClick={onClickUpdate} /><T>USA</T>
                      </li>
                      <li>
                      <input type="checkbox" id="filterEndRegion_JAPAN" onClick={onClickUpdate} /><T>Japan</T>
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

