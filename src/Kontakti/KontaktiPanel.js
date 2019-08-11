

import React, { Component } from "react";
//import { getContacts } from "../WebApi";
import { getContacts } from "../WebApis/requestsGraphQL.js";
import GoogleMapReact from 'google-map-react';

import Marker from './Marker';



class KontaktiPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { center: null, contacts: [] };
    this.loadContacts = this.loadContacts.bind(this);
    this.loadContacts();
  }
  static defaultProps = {
    center: {
      lat: 43.856662,
      lng: 18.412807
    },
    zoom: 15
  };

  async loadContacts() {

    let c = await getContacts();
    console.log("KONTAKTO: ", c);
    this.setState({ contacts: c });

  }
  //       <h6>  {item.Coordinates.lng}</h6>
  //  <Marker key={1} text={"ordinacija  1"} lat={43.853819} lng={18.403921} />
  render() {

    return (
      <div className="">




        <div style={{ height: '50vh', width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
          <GoogleMapReact defaultCenter={this.props.center} defaultZoom={this.props.zoom} bootstrapURLKeys={{ key: "" }} >
            {this.state.contacts.map(item =>
              <Marker key={item.Coordinates.lat} text={item.Name + ' - ' + item.Street} lat={parseFloat(item.Coordinates.lat)} lng={parseFloat(item.Coordinates.lng)} />
            )}
          </GoogleMapReact>
        </div>

        <div className="col-container">

          {this.state.contacts.map((item, index) =>
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

export default KontaktiPanel;




