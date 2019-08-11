

import React, { Component } from 'react';
import MainPhoto from './Photo/Veterinary.jpg';


class Home extends Component {
  render() {
    return (

      <div >

          <br />
                   <img  src={MainPhoto}  style={{ width: '100%' }} alt="Naslovna"  />
                  
                   <h1>Dobrodošli</h1>
                   <p className="lead">Veterinarska ordinacija</p> 
        
</div>
    );
  }
}

export default Home;