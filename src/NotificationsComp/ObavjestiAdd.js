import React, { Component } from "react";
//import { saveObavjest } from "../WebApi";
//import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { addNotification } from '../actions/notificationActions';
//import { addObavjest } from "../WebApis/requestsGraphQL.js";

class ObavjestiAdd extends Component {
  constructor(props) {
    super(props);
    this.state = { showSuccessAlert: false, showErrorAlert: false, alertMessage: "" };
    this.save = this.save.bind(this);
  }

  save() {
    if (!this.validiraj()) {
      this.setState({ showSuccessAlert: false, showErrorAlert: true, alertMessage: "Please add requared fields" });
      return;
    }
    var obavjest = {
      Naslov: this.title.value,
      Sadrzaj: this.content.value,
      Datum: new Date().toString(),
      KreiraoID: this.props.auth.user.id,
      Aktivno: true
    };

   // addObavjest(obavjest);
    this.props.addNotification(obavjest);
    this.content.value = this.title.value = "";
    this.setState({ showErrorAlert: false, showSuccessAlert: true, alertMessage: "You successfully save data." });
    //alert("Uspjesno izvrseno spasavanje nove obavjesti!");
    //redirect na obavjesti:

    // this.props.history.push('/Obavjesti');


  }
  validiraj() {
    let valid = true;
    this.title.className = this.content.className =
      "form-control form-control-sm";
    if (this.title.value.length < 1) {
      this.title.className = "form-control form-control-sm is-invalid";
      valid = false;
    }
    if (this.content.value.length < 1) {
      this.content.className = "form-control form-control-sm is-invalid";
      valid = false;
    }
    return valid;
  }

  render() {

    return (

      <div className="">

        {this.state.showSuccessAlert === true ?
          <div className="alert alert-dismissible alert-success">
            <strong>Well done!</strong> {this.state.alertMessage}
          </div>
          : ""}
        {this.state.showErrorAlert === true ?
          <div className="alert alert-dismissible alert-danger">
            <strong>Oh snap!</strong> {this.state.alertMessage}
          </div>
          : ""}


        Title  <input className="form-control form-control-sm" ref={ref => (this.title = ref)} placeholder="" type="text" />
        Content  <textarea className="form-control" placeholder="" rows="10" ref={ref => (this.content = ref)} />
        <br />

        <button className="btn btn-primary btn-block" onClick={this.save}>Save </button>
      </div>


    );
  }
}

//export default ObavjestiAdd;

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {addNotification})(ObavjestiAdd);
