import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';

import { FilterComponent } from '../../ui/components/FilterComponent.jsx';
import { StagePanelComponent } from '../../ui/components/StagePanelComponent.jsx';

export default class DashboardComponent extends Component {
  render(){
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 panel panel-default" id="render-panel-filter">
            <FilterComponent />
          </div>
            
          <div className="col-md-10 panel panel-default" id="render-panel-stage-panels">
            <div className="row">
              <StagePanelComponent IDNO_STATE= "1" />
              <StagePanelComponent IDNO_STATE= "2" />
            </div>
            <div className="row">
              <StagePanelComponent IDNO_STATE= "3" />
              <StagePanelComponent IDNO_STATE= "4" />
            </div>
            <div className="row">
              <StagePanelComponent IDNO_STATE= "5" />
              <StagePanelComponent IDNO_STATE= "6" />
            </div>
            <div className="row">
              <StagePanelComponent IDNO_STATE= "7" />
              <StagePanelComponent IDNO_STATE= "8" />
            </div>
            <div className="row">
              <StagePanelComponent IDNO_STATE= "9" />
              <StagePanelComponent IDNO_STATE="10" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

