

import React, { Component } from 'react';
//import {getTerminiByDoktor} from '../WebApi';


class RowCell extends Component {
  constructor(props) {
    super(props);
    this.onClickHandle = this.onClickHandle.bind(this);
  }
  onClickHandle(action) {
    console.log("this.props.terminID : ", this.props.terminID);
    console.log("this.props: ", this.props);
    this.props.onClickAction(action, this.props.terminID, this.props.VlasnikID);
  }

  render() {  //console.log("CELL: ",this.props);
    let cell="";
    let buttons;
    if (this.props.terminID === null) {
      cell = "";
    } else {
      if (this.props.status === true) {
        cell = <span role="img" aria-label="emoji" className="text-info">&#9989; Done</span>
        buttons = <div className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("INFO") }}><p className="text-info">details</p></button>
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("RACUN") }}><p className="text-warning">izdaj račun</p></button>
        </div>
      }
      else {
        cell = <span> <span role="img" aria-label="emoji" className="text-success">&#x26AB; Active</span>    </span>;
        buttons = <div className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("UKLONI") }}><p className="text-danger">cancel</p></button>
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("INFO") }}><p className="text-info">details</p></button>
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("EVIDENTIRAJ") }}><p className="text-primary">register</p></button>
        </div>
      }
    }



    return (

      <td className="custtd">
        {this.props.Klijent !== undefined && this.props.terminID !== null ?
              <div className="custtermincard">
                    <center>  {cell} <h4> {this.props.Klijent}</h4>{buttons}</center>
              </div>
          : ""}
      </td>



    );
  }
}
export default RowCell;