import React, { Component } from 'react';
///import {getTerminDetails} from '../WebApi';
import { getTerminDetails } from "../WebApis/requestsGraphQL.js";

import { getDateObject } from '../Utils/DateUtils';

class TerminDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { Termin: null, Usluga: null, Pacijent: null }
    this.loadDetailsTermin = this.loadDetailsTermin.bind(this);
    this.loadDetailsTermin();
  }
  async loadDetailsTermin() {
    var D = await getTerminDetails(this.props.id);
    D.Termin.Date = await await getDateObject(D.Termin.Date);

    await this.setState({ Termin: D.Termin, Usluga: D.Usluga, Pacijent: D.Pacijent })

    // console.log("render TERMIN IZ BAZE JE :", this.state.TerminiDetails.Datum);
  }

  render() {
    return (
      <div>
        {this.state.Termin !== null &&
          <div>

            <center>
              <h6> Appointment Details</h6>
              <h4>{this.state.Termin.Date.Day + ' ' + this.state.Termin.Date.MonthName + '  ' + this.state.Termin.Date.Year
                + ', ' + this.state.Termin.Date.DayName + ', at ' + this.state.Termin.Vrijeme + ":00 h"
              }
              </h4>
              <img src={this.state.Termin.VlasnikSlika} alt="Client pic" style={{ height: "100px", width: "100px", borderRadius: "50%" }} />
              <h6>Client</h6>
              <h4 className="text-muted">{this.state.Termin.Vlasnik}</h4>
              <h6> {this.state.Termin.Napomena}</h6>

              {this.state.Termin.Obavljen === true ?

                <div>
                  <hr />
                  <h6> Medical Service Details</h6>
                  <h4>{this.state.Usluga.VrstaUsluge}</h4>

                  <h4 className="text-muted">{this.state.Usluga.Cijena} KM</h4>
                  <img src={this.state.Pacijent.Slika} alt="Pet pic" style={{ height: "100px", width: "100px", borderRadius: "50%" }} />
                  <h6>Pet</h6>
                  <h4 className="text-muted">{this.state.Pacijent.Ime}</h4>
                  <h6>{this.state.Usluga.Opis}</h6>

                </div>
                : ""}
              <hr />
            </center>

          </div>
        }
      </div>
    );
  }
}
//Modal.propTypes = {  onClose: PropTypes.func.isRequired,  show: PropTypes.bool,  children: PropTypes.node};
export default TerminDetails;