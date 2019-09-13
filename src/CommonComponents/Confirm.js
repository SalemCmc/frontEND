

import React, { Component } from "react";
import alerto from '../Icons/alerto.png';

class Confirm extends Component {




  render() {
    //const { Obavjesti } = this.state; <h4 className="card-title">Upozorenje!</h4>
    let hrefLink = '#';
    return (
      <div >

<center>

<img src={alerto} style={{ width: '50px',marginBottom:"20px" }} alt="icon" />

        <p className="card-text">{this.props.message}</p>
       
        <hr />
        <a href={hrefLink} className="card-link"onClick={this.props.confirmClick}> YES</a>
        <a href={hrefLink}className="card-link"onClick={this.props.hide}>NO</a>
          
                          

            
 </center>
      </div>
    );
  }
}

export default Confirm;
