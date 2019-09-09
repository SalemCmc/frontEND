



import React, { Component } from "react";
import location from '../CommonComponents/giphy.gif'; 
class Marker extends Component {


  render() {

    return (
      <button type="button" className="btn btn-link"
       data-toggle="tooltip" title={this.props.text}>
       
       <img src={location} style={{ width: '50px', margin: 'auto', display: 'block' }}alt="location" />
             
       </button> 
    );
  }
}

export default Marker;


