
import React, { Component } from 'react';
import { getUserByIDG, getAppointments, getPetByOwnerID, getStatisticsData } from "../WebApis/requestsGraphQL.js";
import avatarDefault from '../CommonComponents/avatarDefault.jpg'
import { getDayName, getDateString } from '../Utils/DateUtils';
import Modal from '../CommonComponents/Modal';
import PetDetail from '../PetsComp/PetDetail';
import AppointmentDetails from '../AppointmentsComp/AppointmentDetails';
import { Link } from 'react-router-dom'

import apo from '../Icons/apo.jpg';
import apos from '../Icons/apos.jpg';
import euro from '../Icons/euro.jpg';
import newapo from '../Icons/newapo.jpg';
import sapa from '../Icons/sapa.jpg';
//REDUX:
import { connect } from 'react-redux';
import { handleAppointmentsModal } from '../actions/appointmentsActions';

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { Korisnik: {}, timeLineList: [], timelineRow: 0, pets: { items: [] }, petRow: 0, showModal: false, modalTitle: "", statisctics: {}, showPets: false };
    this.loadDetails = this.loadDetails.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.loadTimeline = this.loadTimeline.bind(this);
    this.loadPets = this.loadPets.bind(this);

    this.loadDetails();
  }
  async handleModal(action, id) {
    let childComp = "";
    let modTitle = "";
    if (action === "TIMELINEDETAIL") {

      this.props.handleAppointmentsModal("DETAILS", id);
      childComp = <AppointmentDetails id={id} />;
      modTitle = "Appointment Details";
    }
    else {
      childComp = <PetDetail petID={id} />;
      modTitle = "Pet Details";
    }
    await this.setState({ showModal: !this.state.showModal, childModalComp: childComp, modalTitle: modTitle });
  }
  async loadDetails() {

    let timeline = await getAppointments(this.props.match.params.id, "0");
    let pets1 = await getPetByOwnerID(this.props.match.params.id, 0, 3);
    let stat = await getStatisticsData(this.props.match.params.id);


    this.setState({ timeLineList: timeline, pets: pets1, statisctics: stat });
    getUserByIDG(this.props.match.params.id).then(res => {
      let K = res;

      if (K != null) {
        if (K.Slika === undefined || K.Slika === null || K.Slika === "") {
          K.Slika = avatarDefault;
        }
      }

      let showPets1 = true;
      if (this.props.auth.user.id === K._id && this.props.auth.user.rola === "Doctor") {
        showPets1 = false;
      }

      this.setState({ Korisnik: K, slikaURL: K.Slika, showPets: showPets1 });

    })
  }
  async loadTimeline() {

    var listPrva = this.state.timeLineList;
    var listDruga = await getAppointments(this.props.match.params.id, this.state.timeLineList.length.toString());
    var listMerg = listPrva.concat(listDruga);
    this.setState({ timeLineList: listMerg });
  }
  async loadPets(action) {

    let row = this.state.petRow;
    if (action === "NEXT") {
      row = row + 1;
    }
    else {
      row = row - 1;
    }
    if (row < 0 || this.state.pets.count === row) { return; }
    var newPets = await getPetByOwnerID(this.props.match.params.id, row, 3);
    this.setState({ pets: newPets, petRow: row });
  }

  render() {
    console.log("state: ", this.state.showPets);

    return (
      <div>
      

        <Modal show={this.state.showModal} handleClose={this.handleModal} title={this.state.modalTitle} >

          {this.state.childModalComp}
        </Modal>
        <div className="custtitlebox"> <h4 className="text-muted">User details</h4></div>
      
      <div className="custcontent" >
        <div className="conteiner33procent">
          <div className="leftnavitem">

            <center>  <img className="custimg" src={this.state.Korisnik.Slika} alt="photoUser" />
              <h4>{this.state.Korisnik.Ime + ' ' + this.state.Korisnik.Prezime}</h4>  </center>
            <hr />
            <p>
              <span className="text-muted" role="img" aria-label="nn" > &#128219;   Profession</span>
              <span className="text-right" role="img" aria-label="nn">  <b className="right">{this.state.Korisnik.Titula}</b></span>
            </p>
            <p>
              <span className="text-muted" role="img" aria-label="nn"> &#128219; Citizen ID</span>
              <span className="text-right" role="img" aria-label="nn">  <b className="right">{this.state.Korisnik.BrLicneKarte}</b></span>
            </p>
            <p>
              <span className="text-muted" role="img" aria-label="nn"> &#128241; Phone</span>
              <span className="text-right" role="img" aria-label="nn">  <b className="right">{this.state.Korisnik.Telefon}</b></span>
            </p>
            <p>
              <span className="text-muted" role="img" aria-label="nn"> &#9993; Email</span>
              <span className="text-right" role="img" aria-label="nn">  <b className="right">{this.state.Korisnik.Email}</b></span>
            </p>
            <p>
              <span className="text-muted" role="img" aria-label="nn">&#127968; Street</span>
              <span className="text-right" role="img" aria-label="nn">  <b className="right">{this.state.Korisnik.Adresa}</b></span>
            </p>
            <p>
              <span className="text-muted" role="img" aria-label="nn"> &#128104; Username</span>
              <span className="text-right" role="img" aria-label="nn">  <b className="right">{this.state.Korisnik.Username}</b></span>
            </p>
            <p>
              <span className="text-muted" role="img" aria-label="nn"> &#128197; Member since</span>
              <span className="text-right" role="img" aria-label="nn">  <b className="right">{this.state.Korisnik.DatumUnosa}</b></span>
            </p>
            <hr />
            <Link className="btn btn-outline-secondary btn-block" to={"/UserAdd/" + this.state.Korisnik._id}>EDIT</Link>

          </div>
        </div>



        <div className="conteiner33procent">
          <div className="leftnavitem">
            <center> <h5 className="text-muted">Appointments Timeline</h5></center>
            <div className="timelineconteiner">
              {this.state.timeLineList.map((item, index) =>
                <div key={item.id} onClick={() => { this.handleModal("TIMELINEDETAIL", item.id) }}>
                  {(index === 0 && item.Done === true) ? <h5 className="text-muted">&nbsp; Done </h5> : ""}
                  {(index === 0 && item.Done === false) ? <h5 className="text-muted"> &nbsp; Incoming </h5> : ""}
                  {(index !== 0 && this.state.timeLineList[index - 1].Done === false && item.Done === true) ? <h5 className="text-muted">&nbsp; Done </h5> : ""}

                  <div className={item.Done === false ? "timelineitem" : "timelineitemdone"} >
                    {item.ClientID === this.props.match.params.id ? <h6>Appointment with <b>{'Dr. ' + item.Doctor}</b></h6> : <h6>Appointment with <b> {item.Client}</b></h6>}
                    <h5 className="text-muted">{getDateString(item.Date)}</h5>
                    <h6 className="text-muted">{getDayName(item.Date) + ' at ' + item.Time + ':00 h'}</h6>

                  </div></div>
              )}</div>
            <center> <button type="button" className="btn btn-link" onClick={this.loadTimeline}>Load more...</button> </center>

          </div> </div>


        <div className="conteiner33procent">
          <div className="leftnavitem">
            <center> <h5 className="text-muted">Other info</h5>
            <hr/>
              <img src={newapo} className="mediumicon" alt="incoming apo..." />
             <h5 className="text-muted">{this.state.statisctics.IncomingAppointments + '  Incoming Appointments'}</h5>
             <hr/>
             <img src={apo} className="mediumicon" alt="done apo..." />
             <h5 className="text-muted">{this.state.statisctics.DoneAppointments + '  Done Appointments'} </h5>
             <hr/>
             <img src={apos} className="mediumicon" alt="Loading..." />
             <h5 className="text-muted">{this.state.statisctics.DoneAppointmentsCurrentMonth + '  Done Appointments curent month'}   </h5>
             <hr/>
             <img src={euro} className="mediumicon" alt="money" />
           <h5 className="text-muted">{this.state.statisctics.TotalCosts + '  Total Costs'}</h5>
           <hr/>
           <img src={sapa} className="mediumicon" alt="pets..." />
           <h5 className="text-muted">{this.state.statisctics.Pets + '  Pets'}</h5>
           <hr/>
           </center>

          </div></div>
         





        {this.state.showPets === false ? "" :
          <div className="petpnl">
     <center>        
            <h5>
            <button className="custarrow" onClick={() => { this.loadPets("PREV") }}>&#10094;</button>
               <a className="text-muted ">Pets</a>
             <button className="custarrow" onClick={() => { this.loadPets("NEXT") }} >&#10095;</button>
             </h5>  <hr />
            
           
            {this.state.pets.items.map((item) =>
              <div key={item._id} className="conteiner33procent" >
                 <img className="petitemimage" src={item.Slika} alt="photoUser" onClick={() => { this.handleModal("PETEDETAIL", item._id) }} />
                  <h5 className="text-muted">{item.Ime} </h5>  
              </div>
            )}         
            </center>
          </div>
        }

      </div>
      </div>);
  }
}
//export default UserDetails;
// REDUX:
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { handleAppointmentsModal })(UserDetails);