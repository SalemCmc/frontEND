import React, { Component } from "react";

import animals from '../Photo/animals.png';
import doctor from '../Photo/doctor.jpg';

// REDUX:
import { connect } from 'react-redux';
import { getOurTeam } from '../actions/usersActions';

class Clinic extends Component {

  componentDidMount() {

    if (this.props.team.length < 1) {
     // this.props.getOurTeam();
    }

  }

  // OVO IZNAD NIJE OK NESTO I PREPRAVI GRAPH QL parametre povratne da bude drugacije za ovaj poziv


  render() {
   // console.log("RENDER:", this.props.loading);


    return (
      <div >
        <div className="custtitlebox"> <h4 className="text-muted">Our clinic</h4></div>
        <div className="custcontent " style={{backgroundColor: "white"}}>
  
  

  <center>
  <img  src={animals}  alt="iconn"  />
      <h4>We care about pets</h4>
      Our small animal clinic works with animals ranging from dogs to cats, rabbits, birds, reptiles (e.g. snakes, turtles), pocket pets (i.e. hamsters, gerbils, guinea pigs) -- and more. Our veterinarians are all degreed professionals who have years of experience and our staff is warm, friendly and polite. We know you'll love our pet clinic!
When you visit our Price Hill clinic, the staff will check you in right away. Our comfortable waiting area is designed to make all animals and people feel safe while they wait to be seen by their doctor. You'll find it's comfortable too.
From the "small animal" section to the large dog area everyone has a place at our clinic. Come by and visit today!
</center>
<br/>

<div className="conteiner33procent">
<img  src={doctor}  alt="iconn" style={{width: "100%"}}  />
</div>

<div className="conteiner66procent">
<center>
<h4>The staff </h4>
At Covedale Pet Hospital, our staff will do everything they can to make sure each visit is a good one. From arrival to checking out, they strive to provide fast, efficient service with a smile! Whether you come into the office in person or call, you can always be sure our staff will help you find whatever it is you need.
<h4>The vets</h4>
Our vets can work with nearly any large, medium or small animal. From general physicals to vaccinations and surgery, they are equipped to do almost anything you need. We are a full-service vet clinic in the Price Hill area and we're happy to work with all our furry (and not so furry!) friends.
<h4>Customer service</h4>
At Covedale Pet Hospital we aim to satisfy. Customer service is at the heart of everything we do and we think you'll be able to tell! We love working with animals of all shapes and sizes.

<h4>Physical exams</h4>
It doesn't matter what type of pet you have, a routine physical is a smart thing to do each year.
Not only does it help you catch any health issues before they become a big problem, but it also gives your pet a chance to get to know their veterinarian a bit.
And you'll have a chance to ask any questions you may have about caring for your pet.
At Covedale Pet Hospital, we believe wholeheartedly in preventative care.
Ask us about setting up a program of regularly scheduled check-ups.
<h4>Other services</h4>
Dental care is extremely important for your pets. Having a good set of teeth and gums not only helps your precious furry friend to eat well, but it also will help avoid painful dental decay, bad breath, and the negative impact it can have on other areas of their health.
We also offered advanced laser surgery treatments at our clinic in Price Hill. This procedure offers incredible benefits over traditional surgery, such as less pain, less bleeding, less chance of infections, less swelling, and less discomfort.
For the best in pet dental care and surgery, put your trust in Covedale Pet Hospital!

</center>
</div>

<hr/>


  

  
   </div>
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

export default connect(mapStateToProps, { getOurTeam })(Clinic);
