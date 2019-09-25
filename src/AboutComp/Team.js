import React, { Component } from "react";

import linkedin from '../Icons/linkedin.png';
import facebook from '../Icons/facebook.png';
import twitter from '../Icons/twitter.png';
import Spinner from '../CommonComponents/Spinner'
// REDUX:
import { connect } from 'react-redux';
import { getOurTeam } from '../actions/usersActions';

class Team extends Component {

  componentDidMount() {

    if (this.props.team.length < 1) {
      this.props.getOurTeam();
    }

  }

  // OVO IZNAD NIJE OK NESTO I PREPRAVI GRAPH QL parametre povratne da bude drugacije za ovaj poziv


  render() {
   // console.log("RENDER:", this.props.loading);


    return (
      <div >
        <div className="custtitlebox"> <h4 className="text-muted">Meet our team</h4></div>
        <div className="custcontent"> 
        {this.props.loading === true ?
                <Spinner  />
                : 
          <div className="custbodyconttent"> <br/>
            {this.props.team.map(item => (
              <div key={item._id}>
                <div className="conteiner33procent">
                  <center><img className="custimg" src={item.Slika} alt="photoUser" /></center>
                </div>
                <div className="conteiner66procent">
                  <h4 className="text-muted">{item.Ime + ' ' + item.Prezime + ', ' + item.Titula}</h4>
                  <p>
                    <span className="text-muted" role="img" aria-label="nn"> &#128241; Phone:</span>
                    <span className="text-right" role="img" aria-label="nn">  {item.Telefon}</span>
                  </p>
                  <p>
                    <span className="text-muted" role="img" aria-label="nn"> &#9993; Email:</span>
                    <span className="text-right" role="img" aria-label="nn">  {item.Email}</span>
                  </p>
                  <img className="custimg" src={linkedin} onClick={() => window.open(item.Linkedin, "_blank")} alt="iconn" style={{ height: "45px", width: "45px", cursor: "pointer", marginRight: "15px" }} />
                  <img className="custimg" src={facebook} onClick={() => window.open(item.Facebook, "_blank")} alt="iconn" style={{ height: "45px", width: "45px", cursor: "pointer", marginRight: "15px" }} />
                  <img className="custimg" src={twitter} onClick={() => window.open(item.Twetter, "_blank")} alt="iconn" style={{ height: "45px", width: "45px", cursor: "pointer", marginRight: "15px" }} />
                  <p className="desctext"> {item.About}</p>
                </div>
                <hr />
              </div>
            ))}

          </div>
         } </div>
      </div>

    );
  }
}
//export default Team;
const mapStateToProps = state => ({
  users: state.users,
  team: state.users.ourTeam,
  loading: state.users.loadingTeam
});

export default connect(mapStateToProps, { getOurTeam })(Team);
