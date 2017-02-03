import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';
import ChassisComponent from '../components/ChassisComponent.jsx';

const Dashboard = () => (
  <div className="Documents">
    <Row>
      <Col xs={ 12 }>
        <div className="page-header clearfix">
          <h4 className="pull-left">Dashboard</h4>
        </div>
        <ChassisComponent />
      </Col>
    </Row>
  </div>
);

export default Dashboard;
