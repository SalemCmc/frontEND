

import React, { Component } from 'react';

import TerminiKlijent from './TerminiKlijent';
import TerminiDoktor from './TerminiDoktor';

import { connect } from 'react-redux';


class Termini extends Component {


  render() {
    // console.log("logirani user: ", this.props.auth.user);
    let itemTermin = null;
    if (this.props.auth.user.rola === "Doctor") {
      itemTermin = <TerminiDoktor />;
    }
    if (this.props.auth.user.rola === "Client") {
      itemTermin = <TerminiKlijent />;
    }
    return (<div>{itemTermin}</div>);

  }
}
//export default Termini;
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Termini);