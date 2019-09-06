import React, { Component } from 'react';
//import ReactDOM from 'react-dom';



 class Footer extends Component {

  render() 
  {
    let tempDate = new Date();
    return (
      <div  className="custfooter">
                  
                  <p>&copy; {tempDate.getFullYear()} - Završni rad "Veterinarska ordinacija" by: Salem Jahić-3194 &#9774; (novembar 2018) </p>
              </div>

            );
  }
}
export default Footer;