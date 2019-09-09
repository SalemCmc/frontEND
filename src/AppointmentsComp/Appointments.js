

import React, { Component } from 'react';

import AppointmentPanelClient from './AppointmentPanelClient';
import AppointmentPanelDoctor from './AppointmentPanelDoctor';

import { connect } from 'react-redux';


class Appointments extends Component {


  render() {
    // console.log("logirani user: ", this.props.auth.user);
    let itemAppointments = null;
    if (this.props.auth.user.rola === "Doctor") {
      itemAppointments = <AppointmentPanelDoctor />;
    }
    if (this.props.auth.user.rola === "Client") {
      itemAppointments = <AppointmentPanelClient />;
    }
    return (<div>{itemAppointments}</div>);

  }
}
//export default Appointments;
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Appointments);