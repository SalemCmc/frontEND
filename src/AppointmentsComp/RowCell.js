

import React, { Component } from 'react';
//import {getTerminiByDoktor} from '../WebApi';


class RowCell extends Component {
  constructor(props) {
    super(props);
    this.onClickHandle = this.onClickHandle.bind(this);
  }
  onClickHandle(action) {

    this.props.onClickAction(action, this.props.terminID, this.props.VlasnikID);
  }
  generateElements() {

    let status = "";
    let cName = "";
    let buttons = "";
    if (this.props.status !== null) {
      if (this.props.status !== true) {
        cName = "custtdactive";
        status = <span> <span role="img" aria-label="emoji" className="text-warning">&#x26AB; I n c o m i n g</span>    </span>;
        buttons = <div className="btn-group" role="group" aria-label="Basic example" >
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("UKLONI") }}><p className="text-danger">cancel</p></button>
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("INFO") }}><p className="text-info">details</p></button>
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("EVIDENTIRAJ") }}><p className="text-primary">register</p></button>
        </div>;
        let dat = new Date(this.props.date)
        if (dat.setHours(0,0,0,0) < (new Date().setHours(0,0,0,0))) {
          cName = "custtexpired";
          status = <span> <span role="img" aria-label="emoji" className="text-secondary">&#9940; E x p i r e d</span>    </span>;
          buttons = <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("INFO") }}><p className="text-info">details</p></button>
          </div>;
        }
        if (dat.setHours(0,0,0,0) === (new Date().setHours(0,0,0,0))) {
         
          status = <span> <span role="img" aria-label="emoji" className="text-danger">&#x26AB; T O D A Y !</span>    </span>;

        }
      }
      else {
        cName = "custtddone";
        status = <span role="img" aria-label="emoji" className="text-success">&#9989; D o n e</span>;
        buttons = <div className="btn-group" role="group" aria-label="Basic example" >
          <button type="button" className="btn btn-link" onClick={() => { this.onClickHandle("INFO") }}><p className="text-info">details</p></button>
        </div>;
      }
    }

    let generatedElements = {};
    generatedElements.cName = cName;
    generatedElements.status = status;
    generatedElements.buttons = buttons

    return generatedElements;

  }
  render() {

    let generatedElem = this.generateElements();
    let status = generatedElem.status;
    let buttons = generatedElem.buttons;
    let cName = generatedElem.cName;

    return (

      <td className={cName}>

        <center>  {status} <h4> {this.props.Klijent}</h4>{buttons}</center>

      </td>



    );
  }
}
export default RowCell;