import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import { render } from 'react-dom';

import { FilterComponent } from '../../ui/components/FilterComponent.jsx';
import { LinePanelsComponent } from '../../ui/components/LinePanelsComponent.jsx';

export default class DashboardComponent extends Component {
  render(){
    let currentUser = this.props.currentUser;
    let userDataAvailable = (currentUser !== undefined);
    let loggedIn = (currentUser && userDataAvailable);
    return (
            <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 panel panel-default" id="render-panel-filter">
                    <FilterComponent />
                </div>
                <div className="col-md-10" id="render-panel-filter">
                    <LinePanelsComponent />
                </div>
            </div>
        </div>
    );
  }
}

