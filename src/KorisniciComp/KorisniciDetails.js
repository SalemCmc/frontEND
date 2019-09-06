
import React, { Component } from 'react';
import { getUserByIDG, getAppointments, getPetByOwnerID, getStatisticsData } from "../WebApis/requestsGraphQL.js";
import avatarDefault from '../CommonComponents/avatarDefault.jpg'
import { getDayName, getDateString } from '../Utils/DateUtils';
import Modal from '../CommonComponents/Modal';
import PetDetail from '../PetsComp/PetDetail';
import TerminDetails from '../TerminiComp/TerminDetails';
import { Link } from 'react-router-dom'
//REDUX:
import { connect } from 'react-redux';

class KorisniciDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { Korisnik: {}, timeLineList: [], timelineRow: 0, pets: { items: [] }, petRow: 0, showModal: false, modalTitle: "", statisctics: {} ,showPets:false};
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
      childComp = <TerminDetails id={id} />;
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
 
      let showPets1=true;
      if(this.props.auth.user.id===K._id && this.props.auth.user.rola==="Doctor")
      {
         showPets1=false;
      }
      
       this.setState({ Korisnik: K, slikaURL: K.Slika , showPets:showPets1});

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
console.log("state: ",this.state.showPets);

    return (
      <div className="" >




        <Modal show={this.state.showModal} handleClose={this.handleModal} title={this.state.modalTitle} >

          {this.state.childModalComp}
        </Modal>

        <div className="leftnavipanel">
          <div className="leftnavitem">


            <div style={{ paddingLeft: "5%", paddingRight: "5%" }}>
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
              <p>
                <span className="text-muted"> Active</span>
                <span className="text-right">  <b className="right">{this.state.Korisnik.Aktivan}</b></span>
              </p>
              <hr />

              <Link className="btn btn-outline-secondary btn-block" to={"/KorisniciAdd/" + this.state.Korisnik._id}>EDIT</Link>
            </div>
          </div>
        </div>

        <div className="rightpanel23">
          <div className="half">
            <center> <h5 className="text-muted">Appointments Timeline</h5></center>

            {this.state.timeLineList.map((item, index) =>
              <div key={item.id} onClick={() => { this.handleModal("TIMELINEDETAIL", item.id) }}>
                {(index === 0 && item.Done === true) ? <h5 className="text-muted">Done </h5> : ""}
                {(index === 0 && item.Done === false) ? <h5 className="text-muted">Incoming </h5> : ""}
                {(index !== 0 && this.state.timeLineList[index - 1].Done === false && item.Done === true) ? <h5 className="text-muted">Done </h5> : ""}

                <div className={item.Done === false ? "timelineitem" : "timelineitemdone"} >
                  {item.ClientID === this.props.match.params.id ? <h5>{'Appointment with Dr. ' + item.Doctor}</h5> : <h5>{'Appointment with ' + item.Client}</h5>}
                  <h5 className="text-muted">{getDateString(item.Date)}</h5>
                  <h6 className="text-muted">{getDayName(item.Date) + ' at ' + item.Time + ':00 h'}</h6>
                  <br />
                </div></div>
            )}

            <center> <button type="button" className="btn btn-link" onClick={this.loadTimeline}>Load more...</button> </center>
          </div>
          <div className="half">
            <center> <h5 className="text-muted">Statistics</h5></center>
            <div className="alert alert-dismissible alert-success">
              <h5>{this.state.statisctics.Pets + '  Pets'}</h5>
            </div>
            <div className="alert alert-dismissible alert-warning">
              <h5>{this.state.statisctics.IncomingAppointments + '  Incoming Appointments'}</h5>
            </div>
            <div className="alert alert-dismissible alert-info">
              <h5>{this.state.statisctics.DoneAppointments + '  Done Appointments'} </h5>
            </div>
            <div className="alert alert-dismissible alert-info">
              <h5>{this.state.statisctics.DoneAppointmentsCurrentMonth + '  Done Appointments curent month'}   </h5>
            </div>
            <div className="alert alert-dismissible alert-danger">
              <h5>{this.state.statisctics.TotalCosts + '  Total Costs'}</h5>
            </div>
          </div>


          
          {this.state.showPets===false ? "" :
          <div className="petpnl">
            <center> <h5 className="text-muted">Pets</h5></center> <hr />
            <p className="custarrow" style={{ float: "left" }} onClick={() => { this.loadPets("PREV") }}   >&#10094;</p>
            {this.state.pets.items.map((item) =>
              <div key={item._id} className="petitemdetails" >
                <center>     <img className="petitemimage" src={item.Slika} alt="photoUser" onClick={() => { this.handleModal("PETEDETAIL", item._id) }} />
                  <h5 className="text-muted">{item.Ime} </h5>  </center>
              </div>
            )}
            <p className="custarrow right" onClick={() => { this.loadPets("NEXT") }}    >&#10095;</p>
          </div>
          }




        </div>
      </div>
    );
  }
}

//export default KorisniciDetails;

const mapStateToProps = state => ({
  auth: state.auth

});

export default connect(mapStateToProps)(KorisniciDetails);