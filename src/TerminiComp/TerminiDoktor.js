




import React, { Component } from 'react';
//import { getTerminiByDoktor, ukloniTermin } from '../WebApi';
import { getTerminiByDoktor, ukloniTermin } from "../WebApis/requestsGraphQL.js";
import TerminRowItem from './TerminRowItem';
import TerminDetails from './TerminDetails';
import TerminEvidentiraj from './TerminEvidentiraj';
import TerminAdd from './TerminAdd';
import Spinner from '../CommonComponents/Spinner'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Confirm from "../CommonComponents/Confirm"

import Modal from '../Modal';

class TerminiDoktor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TerminiList: [], currentDate: (new Date(new Date().getFullYear(), new Date().getMonth(),
        new Date().getDate() - new Date().getDay() + 1)),  // ovo je ponedeljak!
      showWek: "",  action: "", showModal: false, modalTitle: ""
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

    let datStringo = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    let T = await getTerminiByDoktor(this.props.auth.user.id, datStringo);

    //let T = getTerminiByDoktor("5c863b423248087600c166ac", datStringo);
    let shWk = this.state.currentDate.toLocaleDateString('de-DE').toString();
    let fridayDate = new Date(this.state.currentDate);   //  <<<-----------------------------OBAVEZNO IDE NEW JER JE OVO REFERENTNI TIP PODATKA!!!
    fridayDate.setDate(this.state.currentDate.getDate() + 4);
    shWk = shWk + ' - ' + fridayDate.toLocaleDateString('de-DE').toString();
    //this.setState({ TerminiList: T, showWek: shWk, show: false })
    this.setState({ TerminiList: T, showWek: shWk })
    //console.log("TERMINS:  : ", this.state.TerminiList);
  }

  async nextWeek() {
    var newDate = new Date(this.state.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    await this.setState({ currentDate: newDate, TerminiList: [] }); // console.log("datum state je KLIKNUTI /dana : ",  this.state.currentDate );
    this.loadTermini();
  }
  async prevWeek() {
    var newDate = new Date(this.state.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    await this.setState({ currentDate: newDate, TerminiList: [] });  //console.log("datum state je KLIKNUTI /dana : ",  this.state.currentDate );
    this.loadTermini();
  }
  async ukloniTermin() {
    //if (window.confirm("Da li ste sigurni da želite ukloniti termin?")) {
     //console.log("uklon termina JE: : ", this.state.idTermin);    // novi tab:   window.open("exit.html", "Thanks for Visiting!");
     
     
      await ukloniTermin( this.state.idTermin);
      this.setState({ TerminiList: [], showModal: false, modalTitle: "" });
      this.loadTermini();

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

  hideModal = () => { this.setState({ showModal: false }); this.loadTermini() };

  getDayDate(day) // generise string za header kolone u tabeli ispod  Mart 22, Jun 12 itd...
  {
    var newDate = new Date(this.state.currentDate);
    newDate.setDate(newDate.getDate() + day);
    return newDate.toLocaleString('en-us', { month: 'short', day: 'numeric' });
  }

  render() {
    let childComponent = null;
    if (this.state.action === "INFO") { childComponent = <TerminDetails id={this.state.idTermin} />; }
    if (this.state.action === "EVIDENTIRAJ") { childComponent = <TerminEvidentiraj id={this.state.idTermin} vlasnikID={this.state.vlasnikID} refreshParent={this.loadTermini} />; }
    if (this.state.action === "REZERVISI") { childComponent = <TerminAdd refreshParent={this.loadTermini} idKlijent={null} />; }
    if (this.state.action === "UKLONI") { childComponent = <div> <Confirm confirmClick={this.ukloniTermin} hide={this.hideModal} message="Are you sure you want cancel this Appointment?" /> </div>; }


    return (
      <div className="" >
        <div>
          <Modal show={this.state.showModal} handleClose={this.hideModal} title={this.state.modalTitle}>
            <div> {childComponent}  </div>
          </Modal>
        </div>

        <div className="custtitlebox">
          <h4 >Weekly Appointment Schedule</h4>
          <Link to="#" onClick={this.rezervisiTermin}>Book Appointment</Link>
        </div>


        <div className="custbodyconttent">
          <br />
          <center>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={this.prevWeek}> ❮ Previouse Week </button> &emsp;
        <input type="text" className="form-control" defaultValue={this.state.showWek} /> &emsp;
         <button type="button" className="btn btn-outline-primary btn-sm" onClick={this.nextWeek}>Next Week  ❯ </button>
            </div></center><br />


          {this.state.TerminiList.length < 1 ?
            <Spinner />
            :
            <table id="tablePreview" className="table table-sm table-bordered">
              <thead><tr className="table-info"><th><center>Time&nbsp;&nbsp;&nbsp;&nbsp; </center></th>
                <th><center>Monday - {this.getDayDate(0)}</center></th>
                <th><center>Tuesday - {this.getDayDate(1)}</center></th>
                <th><center>Wednesday - {this.getDayDate(2)}</center></th>
                <th><center>Thursday - {this.getDayDate(3)}</center></th>
                <th><center>Friday - {this.getDayDate(4)}</center></th></tr>
              </thead>
              <tbody>
                {this.state.TerminiList.map((item, index) =>
                  <TerminRowItem key={index} item={item} sat={index + 8 + ' : 00'} onClickAction={this.onClickAction} />
                )}
              </tbody>
            </table>}
        </div>
      </div>

    );
  }
}
//export default Termini;
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(TerminiDoktor);