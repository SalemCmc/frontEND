

import React, { Component } from 'react';


import AppointmentAdd from './AppointmentAdd';
import Modal from '../CommonComponents/Modal';
import Pagination from "react-js-pagination";
import AppointmentDetails from './AppointmentDetails';
import Spinner from '../CommonComponents/Spinner'
import { Link } from 'react-router-dom'
import Confirm from "../CommonComponents/Confirm"
// REDUX
import { connect } from 'react-redux';
//import { loginUser } from '../actions/authActions';
import { getAppointmentsByClient, handleAppointmentsModal, removeAppointment } from '../actions/appointmentsActions';


class AppointmentPanelClient extends Component {
  constructor(props) {
    super(props);
    this.state = { row: 0, limit: 6, showModal: false, modalTitle: "" };

    this.loadTermini = this.loadTermini.bind(this);
    this.loadTermini();
    this.rezervisiTermin = this.rezervisiTermin.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.ukloniTermin = this.ukloniTermin.bind(this);

  }


  async loadTermini() {

    let searchParams = {};
    searchParams.row = this.state.row;
    searchParams.limit = 6;
    searchParams.pageNumber = this.state.pn;
    this.props.getAppointmentsByClient(searchParams);

    //let T = await getTerminiByKlijent(this.props.auth.user.id, this.state.row.toString(), this.state.limit.toString());
    console.log("TERMINI:");
    //this.setState({ TerminiList: T.Termini, Count: T.Count });


  }
  rezervisiTermin() {  // otvaranje modalnog prozora za rezervisanje termina
    this.setState({ showModal: true, action: "REZERVISI", modalTitle: "Book Appointment" });
  }


  async handlePageChange(pageNumber) {

    let br = (pageNumber - 1) * this.state.limit;
    //console.log(br);
    await this.setState({ row: br, pn: pageNumber });
    this.loadTermini();
  }
  showDetails(ID) {
    this.props.handleAppointmentsModal("DETAILS", ID, null);
    this.setState({ idTermin: ID, showModal: true, action: "INFO", modalTitle: "Details" });
  }


  hideModal = () => { this.setState({ showModal: false, modalTitle: "" }); };
  getDay(date1) {
    let dat = new Date(date1);
    let day = dat.getDate();
    return day;
  }
  getMonthName(date1) {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "Sept.", "October", "Nov.", "	Dec."];
    let dat = new Date(date1);
    let day = dat.getMonth();
    return monthNames[day];
  }
  getDayName(date1) {
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dat = new Date(date1);
    let day = dat.getDay();
    return dayNames[day];
  }
  getYear(date1) {

    let dat = new Date(date1);
    return dat.getFullYear();

  }
  async showModalConfirm(id) {
    console.log("ID KLIK: ", id);
    await this.setState({ idTermin: id, showModal: true, action: "UKLONI", modalTitle: "Confirm Deletion!" });
  }
  ukloniTermin() {
    this.setState({ showModal: false });
    this.props.removeAppointment(this.state.idTermin);
    /*     await ukloniTermin(this.state.idTermin);
        
        this.loadTermini(); */


  }
  render() {
    console.log("RENDER pageNumber: ", this.props.pageNumber);
    let childComponent = null;

    if (this.state.action === "INFO") { childComponent = <AppointmentDetails />; }
    if (this.state.action === "REZERVISI") { childComponent = <AppointmentAdd refreshParent={this.loadTermini} idKlijent={this.props.auth.user.id} />; }
    if (this.state.action === "UKLONI") { childComponent = <div> <Confirm confirmClick={this.ukloniTermin} hide={this.hideModal} message="Are you sure you want cancel this Appointment?" /> </div>; }
    return (
      <div className="" >
        <div>
          <Modal show={this.state.showModal} handleClose={this.hideModal} title={this.state.modalTitle}>
            <div> {childComponent}  </div>
          </Modal>
        </div>

        <div className="custtitlebox">
          <h4 className="text-muted">Your Appointments</h4>
          <Link to="#" onClick={this.rezervisiTermin}>Book Appointment</Link>
        </div>



        {this.props.loading === true ?
          <Spinner />
          :
          this.props.items.map((item, index) =>

            <div className="card mb-3" key={index} style={{ width: '32%', float: 'left', margin: '0.5%' }}>

              <div className="card-body " >

                <time className="icon">
                  <em>{this.getDayName(item.Date)}</em>
                  <strong>{this.getMonthName(item.Date) + ' / ' + this.getYear(item.Date)}</strong>
                  <span>{this.getDay(item.Date)}</span>
                </time>

                <div style={{ backgroundColor: '', float: 'left', marginLeft: '3%', width: '65%' }}>
                  <p >  <b>{this.getDayName(item.Date) + ', ' + item.Vrijeme + ':00 h'}</b></p>
                  <p >{"Appointment with Dr. " + item.Doktor}</p>
                  <p >{"Client: " + item.Vlasnik}</p>
                </div>


                <div style={{ backgroundColor: '', float: 'left', textAlign: 'right', width: '100%' }}>


                  <a href="# " className="card-link" onClick={() => { this.showDetails(item.ID) }} >Details</a>
                  {item.Obavljen !== true ?
                    <a href="# " className="card-link text-danger" onClick={() => { this.showModalConfirm(item.ID) }}>Cancel</a>
                    : ""}

                </div>
              </div>
            </div>

          )}

        <div className="custpaging">
          <Pagination activePage={this.props.pageNumber} itemsCountPerPage={6} onChange={this.handlePageChange}
            totalItemsCount={this.props.count} pageRangeDisplayed={10} innerClass="btn-group mr-2" itemClass="btn btn-outline-primary btn-sm" itemClassFirst="page-item"
            linkClass="" activeLinkClass="" activeClass="page-item active" disabledClass="text-secondary" firstPageText="first" lastPageText="last" nextPageText=">" prevPageText="<"
          />
        </div>
      </div>
    );
  }
}

// export default Login;

const mapStateToProps = state => ({
  auth: state.auth,
  items: state.appointments.appoByClient.items,
  count: state.appointments.appoByClient.count,
  loading: state.appointments.loading,
  pageNumber: state.appointments.searchParams.pageNumber
});

export default connect(mapStateToProps, { getAppointmentsByClient, handleAppointmentsModal, removeAppointment })(AppointmentPanelClient);