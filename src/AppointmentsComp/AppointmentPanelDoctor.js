




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
import { getAppointmentsByDoctor, removeAppointment, handleAppointmentsModal } from '../actions/appointmentsActions';

class AppointmentPanelDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, modalTitle: "", modalComponent: null };


    this.onClickAction = this.onClickAction.bind(this);
    this.rezervisiTermin = this.rezervisiTermin.bind(this);
    this.ukloniTermin = this.ukloniTermin.bind(this);
  }

  componentDidMount() {

    if (this.props.appointments.appoByDoctorList[1].length < 1) {
      this.loadTermini(null);
    }
  }

  async loadTermini(action) {
    await this.props.getAppointmentsByDoctor(action);  // REDUX
  }
  async ukloniTermin() {
    this.props.removeAppointment(this.state.selectedApoID, "Doctor");
    this.hideModal();

  }

  onClickAction(action, id, klijentID) {//poziva se iz subkomponente rowCell kao parametar salje akciju (obrisi termin, evidentiraj, info itd...)

    let childComponent = null;
    let modalTitle = "";

    if (action === "DETAILS") {
      childComponent = <AppointmentDetails />;
      modalTitle = "Appointment Details";
    }
    if (action === "REMOVE") {
      childComponent = <div> <Confirm confirmClick={this.ukloniTermin} hide={this.hideModal} message="Are you sure you want cancel this Appointment?" /> </div>;
      modalTitle = "Confirm Deletion!";
    }

    if (action === "REGISTER") {
      childComponent = <AppointmentRegister appointmentID={id} vlasnikID={this.state.vlasnikID} refreshParent={this.loadTermini} />;
      modalTitle = "Register Medical Service";
    }


    this.setState({ showModal: true, modalTitle: modalTitle, modalComponent: childComponent, selectedApoID: id });
    this.props.handleAppointmentsModal(action, id, klijentID);  // REDUX PREIMENUJ U LOAD MODAL DATA!
  }

  rezervisiTermin() {  // otvaranje modalnog prozora za rezervisanje termina
    let childComponent = null;
    let modalTitle = "";
    childComponent = <AppointmentAdd idKlijent={null} />;
    modalTitle = "Book Appointment";  // NEMOJ ZVATI REDUX!
    this.setState({ showModal: true, modalTitle: modalTitle, modalComponent: childComponent });
    // this.props.handleAppointmentsModal("BOOK_APO");
  }

  hideModal = () => {
    // this.props.handleAppointmentsModal("HIDE");
    this.setState({ showModal: false, modalTitle: "", modalComponent: null });
  };

  getDayDate(day) // generise string za header kolone u tabeli ispod  Mart 22, Jun 12 itd...
  {
    var newDate = new Date(this.props.appointments.currentWeek);
    newDate.setDate(newDate.getDate() + day);
    return newDate.toLocaleString('en-us', { month: 'short', day: 'numeric' });
  }
  generateWeekString() {

    let fromDate = new Date(this.props.appointments.currentWeek);
    let toDate = new Date(this.props.appointments.currentWeek);
    toDate = new Date(toDate.setDate(toDate.getDate() + 4));
    return fromDate.toLocaleString('en-us', { day: 'numeric', month: 'short' }) + ' - ' + toDate.toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  render() {
    // console.log("STATE: ", this.state);
    let childComponent = this.state.modalComponent;

    // console.log("MODAL PROPS:", this.props.appointments.showModal);
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



        <div className="custcontent">


          <div className="custbodyconttent">

            <div className="appotblheader">
              <div className="btn-group" >

                <h4 >{'Week: ' + this.generateWeekString()}</h4>
                &emsp;&emsp;
  
            <div className="" >
                  <button type="button" className="btn btn-success btn-sm" onClick={() => this.loadTermini("previous")}>  ❮ &nbsp;</button>&emsp;
                <button type="button" className="btn btn-success btn-sm" onClick={() => this.loadTermini("next")}>  &nbsp; ❯  </button>
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
      </div>

    );
  }
}
//export default Termini;
const mapStateToProps = state => ({
  //auth: state.auth,
  appointments: state.appointments
});

export default connect(mapStateToProps, { getAppointmentsByDoctor, removeAppointment, handleAppointmentsModal })(AppointmentPanelDoctor);