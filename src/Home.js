

import React, { Component } from 'react';
import MainPhoto from './Photo/Veterinary.jpg';


class Home extends Component {
  render() {
    return (

      <div >

       
        <img src={MainPhoto} style={{ width: '100%' }} alt="Naslovna" />

        <h1>Wellcome</h1>
        <p className="lead">Veterinary practice</p>

      </div>
    );
  }
}

export default Home;