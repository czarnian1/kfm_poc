/*

Active Code : 

*/

import React, { Component, PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class Aboutpanel extends Component {

	render(){
		return(
			<div className="panel panel-default" id="render-panel-left-about">
				<div className="panel-heading">
					<h3 className="panel-title">
						<T>common.main.title</T>
					</h3>
				</div>
				<div className="panel-body">
					<T>common.main.title</T>
				</div>
				<div className="panel-footer">
					<T>common.main.copyright</T>
				</div>
			</div>
  	);
  }
}

export default Aboutpanel
