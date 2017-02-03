import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export const ChassisContainer = (props) => (

<div className="row">
    <div className="col-md-6">
            <div className="panel panel-default" id="child-component-render-chassis-panel">
                <div className="panel-heading"><i className="kubota-KFM_Icons_chassis-icon kubota-fs-48"></i><span className="kubota-fs-32"><T>common.main.chassis_panel</T></span>
                    <div className="list-group-item">
                        <span className="badge" id="render-target-badge-count-chassis"></span><T>common.panel_table.panel_total</T>
                    </div>
                </div>
            <div className="panel-body">
                <table className="table table-striped">
                <thead>
                    <tr>
                        <th><T>common.panel_table.panel_IDNO</T></th>
                        <th><T>common.panel_table.panel_location</T></th>
                        <th><T>common.panel_table.panel_description</T></th>
                        <th><T>common.panel_table.panel_date</T></th>
                        <th><T>common.panel_table.panel_age</T></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ...
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
    <div className="col-md-6">
        ...
    </div>
</div>

);

ChassisContainer.propTypes = {
  user: PropTypes.object,
};

export default createContainer(props => {
	return {
		user: Meteor.user(),
	};

}, ChassisContainer);