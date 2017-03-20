import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Productiontasks } from '../../api/productiontasks.js';

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

Date.prototype.formatDateTime = function()
{
    var r="";
    r+=this.getFullYear();
    r+='-'+('0'+(this.getMonth()+1)).slice( -2 );
    r+='-'+('0'+this.getDate()).slice( -2 );
    r+=' '+('0'+this.getHours()).slice( -2 );
    r+=':'+('0'+this.getMinutes()).slice( -2 );
    r+=':'+('0'+this.getSeconds()).slice( -2 );

    return r;
}

export class StagePanelComponent extends Component {
    render() {
        var column="",icon="",title="";

        switch(parseInt(this.props.IDNO_STATE)){
            case 1:
                column='CHASSIS_LINE_START_DATE';
                icon='kubota-KFM_Icons_chassis-icon';
                title='common.main.CHASSIS_LINE_title';
                break;
            case 2:
                column='PAINT_LINE_START_DATE';
                icon='kubota-KFM_Icons_paint-icon';
                title='common.main.PAINT_LINE_title';
                break;
            case 3:
                column='TRACTOR_LINE_START_DATE';
                icon='kubota-KFM_Icons_tractor-icon';
                title='common.main.TRACTOR_LINE_title';
                break;
            case 4:
                column='REWORK_BEFORE_MQ_START_DATE';
                icon='kubota-KFM_Icons_rework-icon';
                title='common.main.REWORK_BEFORE_MQ_title';
                break;
            case 5:
                column='MQ_LINE_START_DATE';
                icon='kubota-KFM_Icons_mqline-icon';
                title='common.main.MQ_LINE_title';
                break;
            case 6:
                column='REWORK_AFTER_MQ_START_DATE';
                icon='kubota-KFM_Icons_rework-icon';
                title='common.main.REWORK_AFTER_MQ_title';
                break;
            case 7:
                column='PRODUCTION_END_DATE';
                icon='';
                title='common.main.PRODUCTION_END_title';
                break;
            case 8:
                column='INSPECTION_START_DATE';
                icon='';
                title='common.main.INSPECTION_title';
                break;
            case 9:
                column='REWORK_DUR_INSP_START_DATE';
                icon='kubota-KFM_Icons_rework-icon';
                title='common.main.REWORK_DUR_INSP_title';
                break;
            case 10:
                column='SHIPPING_DATE';
                icon='kubota-KFM_Icons_shipped-icon';
                title='common.main.SHIPPING_title';
                break;
            default:
                console.log("StagePanelComponent: Unkown IDNO_STATE #"+this.props.IDNO_STATE+"#");
            }


      return (
                <div className="col-md-6">
                    <div className="panel panel-default" id="child-component-render-chassis-panel">
                        <div className="panel-heading"><i className={icon+' kubota-fs-48'}></i><span className="kubota-fs-32"><T>{title}</T></span>
                            <div className="list-group-item">
                                <span className="badge" id="render-target-badge-count-chassis">{this.props.productsCount}</span><T>common.panel_table.panel_total</T>
                            </div>
                        </div>
                        <div className="panel-body table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th><T>common.panel_table.panel_ID_NO</T></th>
                                        <th><T>common.panel_table.panel_date</T></th>
                                        <th><T>common.panel_table.panel_age</T></th>
                                    </tr>
                                </thead>
                                <tbody>
                                  {this.props.products.map(function(product,i) {
                                    return (
                                      <tr key={i}>
                                        <td>{product["ID_NO"]}</td>
                                        <td>{product[column].formatDateTime()}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        );
    }
};



import { Session } from 'meteor/session'

export default StagePanelComponent = createContainer(({IDNO_STATE,column,icon,title}) => {
  Session.setDefault("filterENDREGION", {$in:["UK"]})

  return {
    products: Productiontasks.find({"IDNO_STATE": parseInt(IDNO_STATE), "ENDREGION":Session.get("filterENDREGION") }).fetch(),
    productsCount: Productiontasks.find({"IDNO_STATE": parseInt(IDNO_STATE), "ENDREGION":Session.get("filterENDREGION") }).count(),
  };
}, StagePanelComponent);
