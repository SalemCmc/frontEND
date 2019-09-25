
import React, { Component } from 'react';

import UploadPhoto from '../CommonComponents/UploadPhoto';
import Pets from '../PetsComp/Pets';
import avatarDefault from '../CommonComponents/avatarDefault.jpg'
//REDUX:
import { connect } from 'react-redux';
import { getUserByID, updateUser } from '../actions/usersActions';

//import { getCommonData } from '../actions/commonActions';

import { getCommonApi } from "../WebApis/requestsGraphQL.js";

class UserAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Korisnik: {}, slikaURL: null, role: [],

      //NOVI KOD:
      action: "", newSlika: "", newAvatar: "", showErrorAlert: false, showSuccessAlert: false, alertMessage: ""
      , nonEditData: false
    };


    this.loadKorisnik = this.loadKorisnik.bind(this);
    this.setPermision = this.setPermision.bind(this);

    // potrebne 
    this.setPhotoUrl = this.setPhotoUrl.bind(this);
    this.getRole = this.getRole.bind(this);

    // NOVI KOD:
    this.bindPanel = this.bindPanel.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.closeAlerts = this.closeAlerts.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validatePermision = this.validatePermision.bind(this);
    this.validateBasicInfo = this.validateBasicInfo.bind(this);
    this.validatePhoto = this.validatePhoto.bind(this);

    this.getRole();
  }




  async loadKorisnik(ID) {

    //registration registration
    if (this.props.match.params.id === "registration" && this.props.auth.isAuthenticated === false) {
      this.rola.options.selectedIndex = this.state.role.findIndex(function (element) { return element.Value === "Klijent" }) + 1;
      this.rola.disabled = true;
      this.setState({ action: "NEWUSER" });
      return;
    }
    // add new user by employee
    if (this.props.match.params.id === "registration" && this.props.auth.userPermisions.includes("UsersADD")) {
      // this.rola.options.selectedIndex = this.state.role.findIndex(function (element) { return element.Value === "Klijent" }) + 1;
      // this.rola.disabled = true;
      this.setState({ action: "NEWUSER" });
      return;
    }

    // 3  IZMJENA PROFILA (nije moguce mijenjati sam sebi rolu)
    // ako rola nije jednaka osoblju omoguciti dodavanje i pregled kucnih ljubimaca!

    await this.props.getUserByID(ID);  // REDUX

    let photo = null;
    if (this.props.users.user != null) {

      if (this.props.users.user.Slika === undefined || this.props.users.user.Slika === null || this.props.users.user.Slika === "") {
        photo = avatarDefault;
      }
      else {
        photo = this.props.users.user.Slika;
      }
    }

    this.setState({ Korisnik: this.props.users.user, slikaURL: photo });

    this.setPermision();

  }

  async setPhotoUrl(photo, avatar) {

    await this.setState({ newSlika: photo, newAvatar: avatar });


  }

  // _________________________________NOVI KOD!_______________________________________________________________________________
  // _________________________________NOVI KOD!_______________________________________________________________________________
  // _________________________________NOVI KOD!_______________________________________________________________________________
  // _________________________________NOVI KOD!_______________________________________________________________________________
  async bindPanel(action1) {
    this.closeAlerts();
    await this.setState({ action: action1 });
    let K = this.props.users.user;
    // bind panels:
    switch (action1) {
      case "BASICINFO":
        this.ime.value = K.Ime;
        this.prezime.value = K.Prezime;
        this.username.value = K.Username;
        this.email.value = K.Email;
        this.datum.value = K.DatumUnosa;
        this.adresa.value = K.Adresa;
        this.licna.value = K.BrLicneKarte;
        this.titula.value = K.Titula;
        this.telefon.value = K.Telefon;
        this.linkedin.value=K.Linkedin;
        this.facebook.value=K.Facebook;
        this.twitter.value=K.Twetter;
        this.about.value=K.About;
        break;
      case "PERMISION":
        this.rola.options.selectedIndex = this.state.role.findIndex(function (element) { return element._id === K.RolaID; }) + 1;
        break;
      case "ACTIVATION":
        this.updateUser();
        break;

      default:
      // code block
    }
  }
  async updateUser() {
    let action = this.state.action;
    let userForUpdate = {};
    userForUpdate._id = this.state.Korisnik._id;

    switch (action) {
      case "BASICINFO":
        if (this.validateBasicInfo()) { return; }
        userForUpdate.Ime = this.ime.value;
        userForUpdate.Prezime = this.prezime.value;
        userForUpdate.Email = this.email.value;
        // userForUpdate.DatumUnosa = this.datum.value;
        userForUpdate.Adresa = this.adresa.value;
        userForUpdate.BrLicneKarte = this.licna.value;
        userForUpdate.Titula = this.titula.value;
        userForUpdate.Telefon = this.telefon.value;
        userForUpdate.Linkedin=this.linkedin.value;
        userForUpdate.Facebook=this.facebook.value;
        userForUpdate.Twetter=this.twitter.value;
        userForUpdate.About=this.about.value;

        break;
      case "PERMISION":
        if (this.validatePermision()) { return; }
        userForUpdate.RolaID = this.rola.options[this.rola.selectedIndex].value;
        break;
      case "PASS":
        if (this.validatePassword()) { return; }
        userForUpdate.Password = this.pass.value;
        userForUpdate.NewPassword = this.newPass.value;
        break;
      case "PHOTO":
        if (this.validatePhoto()) { return; }
        userForUpdate.Slika = this.state.newSlika;
        userForUpdate.Avatar = this.state.newAvatar;
        break;
      case "ACTIVATION":
        userForUpdate.Aktivan = !this.state.Korisnik.Aktivan;
        break;
      case "NEWUSER":
        if (this.validateBasicInfo()) { return; }
        if (this.validatePermision()) { return; }
        if (this.validatePassword()) { return; }
        if (this.validatePhoto()) { return; }
        userForUpdate = this.composeNewUser();  // create full  object with ID=null! (for insert on api)
        //return;
        break;
      default:
      // code block
    }

    await this.props.updateUser(userForUpdate);  // REDUX

    //console.log("na formi updateUser", this.props.userUpdate);
    //let apiResponse = await updateUser(userForUpdate);

    if (this.props.userUpdate.errorStatus === true) {
      this.setState({ showErrorAlert: true, alertMessage: this.props.userUpdate.errorMsg });
    }
    else {
      let atributes = Object.keys(userForUpdate);
      let korisnikForUpdate = this.state.Korisnik;
      atributes.map(item => {
        if (item !== "Password") {
          korisnikForUpdate[item] = this.props.userUpdate[item];
        }
        return "";
      })
      //  console.log(" POSLE SAVE userForUpdate", korisnikForUpdate);
      await this.setState({
        Korisnik: korisnikForUpdate, showSuccessAlert: true,
        alertMessage: "You successfully save data.", action: ""
      });
    }

    //save new data!
    // show message
    // refresh form only with new data!
  }
  closeAlerts() {
    this.setState({ showErrorAlert: false, showSuccessAlert: false });
  }
  validatePassword() {  // reset validation alerts:
    this.setState({ showErrorAlert: false, showSuccessAlert: false, alertMessage: "" });

    if (this.state.action === "NEWUSER") {
      if (this.newPass.value !== this.confirmNewPass.value) {
        this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "New password and Confirm password doesnt match!" });
        window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
        return true;
      }
      if (this.newPass.value.length < 5) {
        this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "New password field must be at least 5 characters!" });
        window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
        return true;
      }
    }
    else {
      if (this.pass.value.length < 5) {
        this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "Password field must be at least 5 characters!" });
        window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
        return true;
      }
      if (this.newPass.value !== this.confirmNewPass.value) {
        this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "New password and Confirm password doesnt match!" });
        window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
        return true;
      }
      if (this.newPass.value.length < 5) {
        this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "New password field must be at least 5 characters!" });
        window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
        return true;
      }
    }
    return false;
  }
  validatePermision() {
    this.setState({ showErrorAlert: false, showSuccessAlert: false, alertMessage: "" });
    if (this.rola.options[this.rola.selectedIndex].value < 1) {

      this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "Role is requared!" });
      window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
      return true;
    }

    return false;
  }
  validateBasicInfo() {
    this.setState({ showErrorAlert: false, showSuccessAlert: false, alertMessage: "" });
    let invalid = false;
    this.licna.className = this.adresa.className = this.ime.className = this.prezime.className = this.username.className = this.email.className = "form-control form-control-sm";


    if (this.username.value.length < 1) {
      this.username.className = "form-control form-control-sm is-invalid"; invalid = true;
    }
    if (!this.email.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      this.email.className = "form-control form-control-sm is-invalid"; invalid = true;
    }
    if (this.licna.value.length < 1) {
      this.licna.className = "form-control form-control-sm is-invalid"; invalid = true;
    }
    if (this.adresa.value.length < 1) {
      this.adresa.className = "form-control form-control-sm is-invalid"; invalid = true;
    }
    if (this.ime.value.length < 1) {
      this.ime.className = "form-control form-control-sm is-invalid"; invalid = true;
    }
    if (this.prezime.value.length < 1) {
      this.prezime.className = "form-control form-control-sm is-invalid"; invalid = true;
    }
    if (invalid) {
      this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "Please enter valid input for requared fields!" });
      window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
    }


    return invalid;
  }
  validatePhoto() {
    this.setState({ showErrorAlert: false, showSuccessAlert: false, alertMessage: "" });
    if (this.state.newAvatar === "" || this.state.newAvatar === null) {
      this.setState({ showErrorAlert: true, showSuccessAlert: false, alertMessage: "Something went wrong! Please try again to upload photo!" });
      window.scrollTo(0, 0);  // scrol to top! becuose validation message is on the top!
      return true;
    }
    return false;
  }
  async getRole() { //  console.log("LOGED USER: ",this.props.auth);
    let rol = await getCommonApi("Korisnici");
    this.setState({ role: rol });
    this.loadKorisnik(this.props.match.params.id);
    // this.setPermision();
  }


  composeNewUser() {
    let newKorisnik = {
      _id: null,
      Ime: this.ime.value,
      Prezime: this.prezime.value,
      Username: this.username.value,
      Password: this.newPass.value,
      Email: this.email.value,
      Adresa: this.adresa.value,
      BrLicneKarte: this.licna.value,
      DatumUnosa: new Date(),
      Titula: this.titula.value,
      Telefon: this.telefon.value,
      RolaID: this.rola.options[this.rola.selectedIndex].value,
      Aktivan: true,
      Slika: this.state.newSlika,
      Avatar: this.state.newAvatar,
      Linkedin:this.linkedin.value,
      Facebook: this.facebook.value,
      Twetter:this.twitter.value,
      About:this.about.value


    };
    console.log("sadrzaj  KORISNIK ID je: :", newKorisnik);
    return newKorisnik;
  }
  setPermision() {
    // REGISTRATION ( if props null, and loged user is null)
    if (this.props.match.params.id === null && this.props.auth.user.id === null) {
      this.rola.options.selectedIndex = this.state.role.findIndex(function (element) { return element.Value === "Client" }) + 1;
      this.rola.disabled = true;
    }
    // 2. MY PROFILE  (role= disabled)
    if (this.props.match.params.id === this.props.auth.user.id) {
      this.setState({ nonEditData: true });
      if (this.props.auth.user.rola !== "Client") {
        this.setState({ petsDisabled: true });
      }
    }
    // 3. edit existing user
    if (this.props.match.params.id !== this.props.auth.user.id) {
      //IF loaded user is client show pets!
      let userRole = this.state.role.find(function (element) { return element.Value === "Client" });
      if (this.state.Korisnik.RolaID === userRole._id) {
        // console.log("ROLA: ",userRole._id);
        this.setState({ nonEditData: true, petsDisabled: false });
      }
      else {
        this.setState({ nonEditData: true, petsDisabled: true });
      }
    }
    // 3. ADD NEW USER by admin or doctor!

    if (this.props.match.params.id === "null" && this.props.auth.user.id != null) {
      this.setState({ nonEditData: false, petsDisabled: false });
    }

  }


  render() { //console.log("ucitana slika: ",this.state.slikaURL);

    //if (this.state.redirect === true) {      return <Redirect to='/Korisnici' />    }

    let classNameActiveBtn = "btn btn-outline-success  btn-block";
    let textActiveBtn = "ACTIVATE USER";
    if (this.state.Korisnik.Aktivan) {
      classNameActiveBtn = "btn btn-outline-danger btn-block";
      textActiveBtn = "DEACTIVATE USER";
    }

    // sub components:
    let basicInfoPanel = null;
    let passInfoPanel = null;
    let photoPanel = null;
    let permisionPanel = null;
    // ----------------basicInfoPanel=null;....
    basicInfoPanel =
      <div className="leftnavitem">
        <h4 className="text-muted"> Basic information</h4> <hr />
        Name *              <input className="form-control form-control-sm" ref={(ref) => this.ime = ref} placeholder="*" type="text" />
        Last name *          <input className="form-control form-control-sm" ref={(ref) => this.prezime = ref} placeholder="*" type="text" />
        Username *         <input className="form-control form-control-sm" ref={(ref) => this.username = ref} placeholder="*" type="text" disabled={this.state.nonEditData} />
        Citizen ID number * <input className="form-control form-control-sm" ref={(ref) => this.licna = ref} placeholder="*" type="text" />
        Email *            <input className="form-control form-control-sm" ref={(ref) => this.email = ref} placeholder="*" type="email" />
        Adress *            <input className="form-control form-control-sm" ref={(ref) => this.adresa = ref} placeholder="*" type="text" />
        Phone numeber           <input className="form-control form-control-sm" ref={(ref) => this.telefon = ref} placeholder="" type="tel" inputMode="numeric" />
        Profession             <input className="form-control form-control-sm" ref={(ref) => this.titula = ref} placeholder="" type="text" />
       
        Linkedin             <input className="form-control form-control-sm" ref={(ref) => this.linkedin = ref} placeholder="" type="text" />
        Facebook             <input className="form-control form-control-sm" ref={(ref) => this.facebook = ref} placeholder="" type="text" />
        Twitter             <input className="form-control form-control-sm" ref={(ref) => this.twitter = ref} placeholder="" type="text" />

       About <textarea className="form-control form-control-sm" rows="3" ref={(ref) => this.about = ref}  placeholder="about client" type="text" />
       
        Date of registration      <input className="form-control form-control-sm" ref={(ref) => this.datum = ref} placeholder={new Date().toJSON().slice(0, 10)} type="text" disabled />

        {this.state.action === "NEWUSER" ? "" : <div><br /><br /><br /><button type="submit" className="btn btn-primary btn btn-sm btn-block" onClick={this.updateUser} >Save</button></div>}
      </div>
    passInfoPanel =
      <div className="leftnavitem">
        <h4 className="text-muted"> Password</h4> <hr />

        {this.state.action === "NEWUSER" ? "" : <div>Password * <input className="form-control form-control-sm" ref={(ref) => this.pass = ref} placeholder="" type="password" /></div>}
        New password * <input className="form-control form-control-sm" ref={(ref) => this.newPass = ref} placeholder="" type="password" />
        Confirm password * <input className="form-control form-control-sm" ref={(ref) => this.confirmNewPass = ref} placeholder="" type="password" />
        {this.state.action === "NEWUSER" ? "" : <div><br /><br /><br /><button type="submit" className="btn btn-primary btn btn-sm btn-block" onClick={this.updateUser} >Save</button></div>}
      </div>
    permisionPanel =
      <div className="leftnavitem">
        <h4 className="text-muted"> Permision</h4> <hr />
        Type of user * <select className="form-control form-control-sm" ref={(ref) => this.rola = ref} disabled={this.state.nonEditData}    >
          <option value="">Choose role(type of user)</option>
          {this.state.role.map(opt => { return (<option key={opt._id} value={opt._id}>{opt.Value}</option>); })}
        </select>
        {this.state.action === "NEWUSER" ? "" : <div><br /><br /><br /><button type="submit" className="btn btn-primary btn btn-sm btn-block" onClick={this.updateUser} >Save</button></div>}
      </div>
    photoPanel =
      <div className="leftnavitem">
        <h4 className="text-muted">Photo</h4> <hr />
        <center>
          <UploadPhoto setPhotoUrl={this.setPhotoUrl} srcPhoto={this.state.slikaURL} /></center>
        <br /><br /><br /><button type="submit" className="btn btn-primary btn btn-sm btn-block" onClick={this.updateUser} >Save</button>
      </div>

    let allPanels = <div>
      {basicInfoPanel}
      {permisionPanel}
      {passInfoPanel}
      {photoPanel}
    </div>

   

    return (



      <div className="" id="mainDiv" >
  <div className="custcontent" >
        {this.props.match.params.id === "registration" ? "" :
       
       <div className="conteiner33procent">
            <div className="leftnavitem">
              <center>
                <img className="custimg" src={this.state.Korisnik.Slika} alt="photoUser" />
                <h4>{this.state.Korisnik.Ime + ' ' + this.state.Korisnik.Prezime}</h4>
                <br />
              </center>
              <button type="button" onClick={this.bindPanel.bind(this, "BASICINFO")} className="btn btn-outline-secondary btn-block" > Basic information</button>
              <button type="button" onClick={this.bindPanel.bind(this, "PHOTO")} className="btn btn-outline-secondary btn-block">Change photo</button>
              <button type="button" onClick={this.bindPanel.bind(this, "PASS")} className="btn btn-outline-secondary btn-block">Change password</button>
              <button type="button" onClick={this.bindPanel.bind(this, "PERMISION")} className="btn btn-outline-secondary btn-block">Permision</button>
              {this.state.petsDisabled === true ? "" :
                <button type="button" onClick={this.bindPanel.bind(this, "PETS")} className="btn btn-outline-secondary btn-block"> Pets</button>
              }
              <br /> <br />
              <button type="button" onClick={this.bindPanel.bind(this, "ACTIVATION")} className={classNameActiveBtn}> {textActiveBtn}</button>
            </div>
          </div>
        }

        <div className="conteiner66procent">

          {this.state.showSuccessAlert === true ?
            <div className="alert alert-dismissible alert-success">
              <button type="button" className="close" onClick={this.closeAlerts} >&times;</button>
              <strong>Well done!</strong> {this.state.alertMessage}
            </div>
            : ""}
          {this.state.showErrorAlert === true ?
            <div className="alert alert-dismissible alert-danger">
              <button type="button" className="close" onClick={this.closeAlerts}>&times;</button>
              <strong>Oh snap!</strong> {this.state.alertMessage}
            </div>
            : ""}

          {this.state.action === "BASICINFO" ? basicInfoPanel : ""}
          {this.state.action === "PASS" ? passInfoPanel : ""}
          {this.state.action === "PHOTO" ? photoPanel : ""}
          {this.state.action === "PETS" ? <Pets VlasnikID={this.state.Korisnik._id} /> : ""}
          {this.state.action === "PERMISION" ? permisionPanel : ""}
          {this.props.match.params.id === "registration" ? allPanels : ""}


        </div>


</div>
      </div>
    );
  }
}

//  export default UserAdd;
const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
  userUpdate: state.users.userUpdate
});

export default connect(mapStateToProps, { getUserByID, updateUser })(UserAdd);