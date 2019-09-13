




import React, { Component } from 'react';

import RowItem from './RowItem';
import AppointmentDetails from './AppointmentDetails';
import AppointmentRegister from './AppointmentRegister';
import AppointmentAdd from './AppointmentAdd';
import Spinner from '../CommonComponents/Spinner'
import { Link } from 'react-router-dom'
import Confirm from "../CommonComponents/Confirm"
import Modal from '../CommonComponents/Modal';

// REDUX:
import { connect } from 'react-redux';
import { getAppointmentsByDoctor, removeAppointment } from '../actions/appointmentsActions';

class AppointmentPanelDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TerminiList: [], currentDate: (new Date(new Date().getFullYear(), new Date().getMonth(),
        new Date().getDate() - new Date().getDay() + 1)),  // ovo je ponedeljak!
      action: "", showModal: false, modalTitle: "", weekAction: null
    };
    this.loadTermini = this.loadTermini.bind(this);
    this.loadTermini();
    this.onClickAction = this.onClickAction.bind(this);
    this.nextWeek = this.nextWeek.bind(this);
    this.prevWeek = this.prevWeek.bind(this);
    this.rezervisiTermin = this.rezervisiTermin.bind(this);
    this.ukloniTermin = this.ukloniTermin.bind(this);
  }



  async loadTermini() {

    let dt = this.state.currentDate;

    let searchParams = {};
    searchParams.doctorID = this.props.auth.user.id;
    searchParams.date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    searchParams.weekAction = this.state.weekAction;
    await this.props.getAppointmentsByDoctor(searchParams);  // REDUX

  }

  async nextWeek() {
    var newDate = new Date(this.state.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    await this.setState({ currentDate: newDate, weekAction: "next" });
    this.loadTermini();
  }
  async prevWeek() {
    var newDate = new Date(this.state.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    await this.setState({ currentDate: newDate, weekAction: "previous" });
    this.loadTermini();
  }
  async ukloniTermin() {

    this.props.removeAppointment(this.state.idTermin, "Doctor");
    this.setState({ showModal: false, modalTitle: "" });
  }


  onClickAction(action, id, klijentID) {//poziva se iz subkomponente rowCell kao parametar salje akciju (obrisi termin, evidentiraj, info itd...)
    //console.log("action: ", action); console.log("klijentID: ", klijentID);
    switch (action) {
      case 'UKLONI': return this.setState({ idTermin: id, showModal: true, action: "UKLONI", modalTitle: "Confirm Deletion!" }); //this.ukloniTermin(id);
      case 'INFO': return this.setState({ idTermin: id, showModal: true, action: "INFO", modalTitle: "Details" });
      case 'RACUN': return alert("Under construction!!");
      case 'EVIDENTIRAJ': return this.setState({ idTermin: id, showModal: true, action: "EVIDENTIRAJ", vlasnikID: klijentID, modalTitle: "Register Medical Service" });
      default: return null;
    }
  }

  rezervisiTermin() {  // otvaranje modalnog prozora za rezervisanje termina
    this.setState({ showModal: true, action: "REZERVISI", modalTitle: "Book Appointment" });

  }
  //  hideModal = () => { this.setState({ showModal: false }); this.loadTermini() };
  hideModal = () => { this.setState({ showModal: false }); };

  getDayDate(day) // generise string za header kolone u tabeli ispod  Mart 22, Jun 12 itd...
  {
    var newDate = new Date(this.state.currentDate);
    newDate.setDate(newDate.getDate() + day);
    return newDate.toLocaleString('en-us', { month: 'short', day: 'numeric' });
  }

  render() {
    let childComponent = null;
    if (this.state.action === "INFO") { childComponent = <AppointmentDetails id={this.state.idTermin} />; }
    if (this.state.action === "EVIDENTIRAJ") { childComponent = <AppointmentRegister id={this.state.idTermin} vlasnikID={this.state.vlasnikID} refreshParent={this.loadTermini} />; }
    if (this.state.action === "REZERVISI") { childComponent = <AppointmentAdd idKlijent={null} />; }
    if (this.state.action === "UKLONI") { childComponent = <div> <Confirm confirmClick={this.ukloniTermin} hide={this.hideModal} message="Are you sure you want cancel this Appointment?" /> </div>; }


    return ( 
      <div className="" >
        <div>
          <Modal show={this.state.showModal} handleClose={this.hideModal} title={this.state.modalTitle}>
            <div> {childComponent}  </div>
          </Modal>
        </div>

        <div className="custtitlebox">
          <h4 className="text-muted">Weekly Appointment Schedule</h4>
          <Link to="#" onClick={this.rezervisiTermin}>Book Appointment</Link>
        </div>




        <div className="custbodyconttent">

          <div className="appotblheader">
            <div className="btn-group" >
              <h4 >{'Week: ' + this.getDayDate(0) + ' - ' + this.getDayDate(4)}</h4> &emsp;&emsp;

            <div className="" >
                <button type="button" className="btn btn-success btn-sm" onClick={this.prevWeek}>  ❮ &nbsp;</button>&emsp;
                <button type="button" className="btn btn-success btn-sm" onClick={this.nextWeek}>  &nbsp; ❯  </button>
              </div>
            </div>

          </div>



          {this.props.appointments.loading === true ?
            <Spinner />
            :
            <table id="tablePreview" className="table table-sm table-bordered">
              <thead><tr className="table-secondary"><th><center>Time&nbsp;&nbsp;&nbsp;&nbsp; </center></th>
                <th><center>Monday - {this.getDayDate(0)}</center></th>
                <th><center>Tuesday - {this.getDayDate(1)}</center></th>
                <th><center>Wednesday - {this.getDayDate(2)}</center></th>
                <th><center>Thursday - {this.getDayDate(3)}</center></th>
                <th><center>Friday - {this.getDayDate(4)}</center></th></tr>
              </thead>
              <tbody>

                {this.props.appointments.appoByDoctorList[1].map((item, index) =>
                  <RowItem key={index} item={item} sat={index + 8 + ' : 00'} onClickAction={this.onClickAction} />
                )}
                <tr className="table-secondary"><th></th><th></th><th></th><th></th><th></th><th></th></tr>
              </tbody>
            </table>}

        </div>
      </div>

    );
  }
}
//export default Termini;
const mapStateToProps = state => ({
  auth: state.auth,
  appointments: state.appointments
});

export default connect(mapStateToProps, { getAppointmentsByDoctor, removeAppointment })(AppointmentPanelDoctor);