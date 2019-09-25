
import React, { Component } from 'react';
import { getUserByIDG, getStatisticsData } from "../WebApis/requestsGraphQL.js";
import avatarDefault from '../CommonComponents/avatarDefault.jpg'

import Modal from '../CommonComponents/Modal';
import PetDetail from '../PetsComp/PetDetail';
import PetsList from '../PetsComp/PetsList';
import AppointmentDetails from '../AppointmentsComp/AppointmentDetails';
import AppointmentTimeline from '../AppointmentsComp/AppointmentTimeline';
import { Link } from 'react-router-dom'
import Spinner from '../CommonComponents/Spinner'
// icons
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
    this.state = { Korisnik: {}, showModal: false, modalTitle: "", statisctics: {}, showPets: false, loading: true };
    this.loadDetails = this.loadDetails.bind(this);
    this.handleModal = this.handleModal.bind(this);



    this.loadDetails();
  }
  async handleModal(action, id) {
    let childComp = "";
    let modTitle = "";
    if (action === "TIMELINEDETAIL") {

      this.props.handleAppointmentsModal("DETAILS", id);  // REDUX
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


    let stat = await getStatisticsData(this.props.match.params.id);

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


      this.setState({ statisctics: stat, Korisnik: K, slikaURL: K.Slika, showPets: showPets1, loading: false });

    })
  }


  render() {
    // console.log("state: ", this.state.showPets);

    return (
      <div>
        <Modal show={this.state.showModal} handleClose={this.handleModal} title={this.state.modalTitle} >
          {this.state.childModalComp}
        </Modal>
        <div className="custtitlebox"> <h4 className="text-muted">User details</h4></div>

        {this.state.loading === true ? <Spinner />
          :
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
              <AppointmentTimeline id={this.props.match.params.id} type="APPOINTMENTS" onClick={this.handleModal} />
            </div>

            <div className="conteiner33procent">
              <div className="leftnavitem">
                <center> <h5 className="text-muted">Other info</h5>
                  <hr />
                  <img src={newapo} className="mediumicon" alt="incoming apo..." />
                  <h5 className="text-muted">{this.state.statisctics.IncomingAppointments + '  Incoming Appointments'}</h5>
                  <hr />
                  <img src={apo} className="mediumicon" alt="done apo..." />
                  <h5 className="text-muted">{this.state.statisctics.DoneAppointments + '  Done Appointments'} </h5>
                  <hr />
                  <img src={apos} className="mediumicon" alt="Loading..." />
                  <h5 className="text-muted">{this.state.statisctics.DoneAppointmentsCurrentMonth + '  Done Appointments curent month'}   </h5>
                  <hr />
                  <img src={euro} className="mediumicon" alt="money" />
                  <h5 className="text-muted">{this.state.statisctics.TotalCosts + '  Total Costs'}</h5>
                  <hr />
                  <img src={sapa} className="mediumicon" alt="pets..." />
                  <h5 className="text-muted">{this.state.statisctics.Pets + '  Pets'}</h5>
                  <hr />
                </center>

              </div></div>
            {this.state.showPets === false ? "" :

              <PetsList id={this.props.match.params.id} onClick={this.handleModal} />

            }

          </div>

        }

      </div>);
  }
}
//export default UserDetails;
// REDUX:
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { handleAppointmentsModal })(UserDetails);