

import React, { Component } from "react";
//import { getContacts } from "../WebApi";  DONT USE!
//import { getContacts } from "../WebApis/requestsGraphQL.js";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

// REDUX:
import { connect } from 'react-redux';
import { getContactsA } from '../actions/contactsActions';



class ContactsPanel extends Component {

  static defaultProps = {
    center: {
      lat: 43.856662,
      lng: 18.412807
    },
    zoom: 15
  };

  componentDidMount() {

    // IF store in REDUX is empty call function getContacts... 
    if (this.props.contacts.contactsList < 1) {
      this.props.getContactsA();
    }
  }


  render() {

    return (
      <div className="">

        <div style={{ height: '50vh', width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
          <GoogleMapReact defaultCenter={this.props.center} defaultZoom={this.props.zoom} bootstrapURLKeys={{ key: "" }} >
            {this.props.contacts.contactsList.map(item =>
              <Marker key={item.Coordinates.lat} text={item.Name + ' - ' + item.Street} lat={parseFloat(item.Coordinates.lat)} lng={parseFloat(item.Coordinates.lng)} />
            )}
          </GoogleMapReact>
        </div>

        <div className="col-container">

          {this.props.contacts.contactsList.map((item, index) =>
            <div key={index} className="custcard">
              <br />
              <h4>  <b>{item.Name}</b> </h4>
              <hr />
              <p>  <span role="img" aria-label="nn"> &#x1F3E0; &nbsp;</span>  {item.Street + ', ' + item.CityCode + ' ' + item.City}</p>

              {item.Phones.map(it => <p key={it}><span> &#x260E; &nbsp;</span>  {it}</p>)}
              {item.Emails.map(it => <p key={it}><span>&#x2709; &nbsp; </span>  {it}</p>)}
              <br />
            </div>
          )}
        </div>
      </div>

    );
  }
}
//export default ContactsPanel;

// REDUX:
const mapStateToProps = state => ({
  contacts: state.contacts
});
export default connect(mapStateToProps, { getContactsA })(ContactsPanel);




