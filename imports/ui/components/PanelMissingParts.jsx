import React, { Component, PropTypes } from 'react';
import { prod_monitor_parts } from '../../api/prod_monitor_parts.js';
import { Link } from 'react-router';
import PanelLocationHealth from './PanelLocationHealth.jsx'

import CF from '../classes/CommonFunctions.jsx';
const cf=new CF();

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

//Production Task component - represents a single tractor item
export class PanelMissingParts extends Component {
    
    render(){
        return(
            <div className="panel panel-default container-fluid">
                <br />

                <PanelLocationHealth ID_NO={this.props.ID_NO}/>
                            
                <div className="panel panel-default">
                    <div className="panel-heading" id="render-production-task-notes">
                        <h3 className="panel-title">
                            <T>ui.common.MissingParts</T>
                        </h3>
                        <br />
                        
                        <table className="table table-responsive table-condensed table-bordered" width="1px">
                            <thead>
                                <tr>
                                    <th className="col-md-1 table-bordered"><center><T>ui.common.Line</T></center></th>
                                    <th className="col-md-1 table-bordered"><center><T>ui.missingParts.ItemNumber</T></center></th>
                                    <th className="col-md-6 table-bordered"><center><T>ui.missingParts.ItemDescription</T></center></th>
                                    <th className="col-md-1 table-bordered"><center><T>ui.missingParts.RequiredQuantity</T></center></th>
                                    <th className="col-md-1 table-bordered"><center><T>ui.missingParts.MissingQuantity</T></center></th>
                                    <th className="col-md-2 table-bordered"><center><T>ui.missingParts.CalculatedDate</T></center></th>
                                </tr>
                            </thead>
                            <tbody id="partsTable" style={{"backgroundColor":"whitesmoke"}}>
                                {this.props.parts.map(function(n){
                                    return(
                                        <tr id={n._id.valueOf()}>
                                            <td className="text-center">{n.SEQ_NO}</td>
                                            <td className="text-center">{cf.formatString(n.ITEM_NUMBER)}</td>
                                            <td className="">{cf.formatString(n.ITEM_DESCRIPTION)}</td>
                                            <td className="text-center">{cf.formatString(n.REQUIREMENT_QTY)}</td>
                                            <td className="text-center">{cf.formatString(n.MISSING_QTY)}</td>
                                            <td className="text-center">{cf.formatDateTime(n.CALCULATED_DATE)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                                    
            </div>
        );
    }

}



import { createContainer } from 'meteor/react-meteor-data';

export default PanelMissingParts = createContainer(({params}) => {
    return {
        ID_NO: params.id,
        parts: prod_monitor_parts.find({"ID_NO": params.id }, {sort:['SEQ_NO']}).fetch(),
  };
}, PanelMissingParts);

