
import React, { Component } from 'react';


//  import { getDateObject } from '../Utils/DateUtils';  OVO OBRISATI
import Spinner from '../CommonComponents/Spinner'
//REDUX: 

import { connect } from 'react-redux';
class AppointmentDetails extends Component {

  ///                      TO DO INCLUDE ERRORS!

  converDate(d) {
    let dat = new Date(d);
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "	December"];

    let D = {};
    D.Day = dat.getDate();
    D.DayName = dayNames[(dat.getDay())];
    D.Year = dat.getFullYear();
    D.MonthName = monthNames[(dat.getMonth())];
    return D;
  }


  render() {

    let customDate = {};
    if (this.props.details.Termin !== undefined) {
      customDate = this.converDate(this.props.details.Termin.Date);
    }

    return (
      <div>
        {this.props.loading === true ?
          <Spinner />
          :
          <div>
            {this.props.details.Termin !== null &&
              <div>

                <center>
                  <h6> Appointment Details</h6>
                  <h4>{customDate.Day + ' ' + customDate.MonthName + '  ' + customDate.Year
                    + ', ' + customDate.DayName + ', at ' + this.props.details.Termin.Vrijeme + ":00 h"
                  }
                  </h4>

                  <img src={this.props.details.Termin.VlasnikSlika} alt="Client pic" style={{ height: "100px", width: "100px", borderRadius: "50%" }} />
                  <h6>Client</h6>
                  <h4 className="text-muted">{this.props.details.Termin.Vlasnik}</h4>
                  <h6> {this.props.details.Termin.Napomena}</h6>

                  {this.props.details.Termin.Obavljen === true ?

                    <div>
                      <hr />
                      <h6> Medical Service Details</h6>
                      <h4>{this.props.details.Usluga.VrstaUsluge}</h4>

                      <h4 className="text-muted">{this.props.details.Usluga.Cijena} KM</h4>
                      <img src={this.props.details.Pacijent.Slika} alt="Pet pic" style={{ height: "100px", width: "100px", borderRadius: "50%" }} />
                      <h6>Pet</h6>
                      <h4 className="text-muted">{this.props.details.Pacijent.Ime}</h4>
                      <h6>{this.props.details.Usluga.Opis}</h6>

                    </div>
                    : ""}
                  <hr />
                </center>

              </div>
            }
          </div>}
      </div>
    );
  }
}
//export default AppointmentDetails;
const mapStateToProps = state => ({
  loading: state.appointments.loadingModal,
  details: state.appointments.appoDetails,
  erros: state.appointments.modalErrors
});

export default connect(mapStateToProps)(AppointmentDetails);