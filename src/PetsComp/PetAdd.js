
import React, { Component } from 'react';

import { getCommonApi } from "../WebApis/requestsGraphQL.js";
import UploadPhoto from '../CommonComponents/UploadPhoto';
import noimage from '../Icons/noimage.jpg';
 // REDUX:
 import { connect } from 'react-redux';
 import { addNewPet } from '../actions/petsActions';

class PetAdd extends Component {
    constructor(props) {
        super(props);
        this.state = { slikaURL: "", types: [] };

        this.setPhotoUrl = this.setPhotoUrl.bind(this);
        this.addPet = this.addPet.bind(this);
        this.validiraj = this.validiraj.bind(this);
        this.getPetType = this.getPetType.bind(this);
        this.getPetType();
    }
    async getPetType() {
                            this.setState({ types: await getCommonApi("Pacijenti") });
    }
    validiraj() {
        let valid = true;
        this.ime.className = this.datum.className = this.rasa.className = this.tezina.className = this.vrsta.className = "form-control form-control-sm";
        if (this.ime.value.length < 1) {
            this.ime.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        if (this.datum.value.length < 1) {
            this.datum.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        if (this.rasa.value.length < 1) {
            this.rasa.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        if (this.tezina.value.length < 1) {
            this.tezina.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        if (this.vrsta.value.length < 1) {
            this.vrsta.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        return valid;
    }
    cleanFields() {
        this.ime.value = this.datum.value = this.rasa.value = this.tezina.value = this.vrsta.value = "";
    }
    async addPet() {
        if (!this.validiraj()) {
            this.setState({ showErrorAlert: true, alertMessage: "Please add requared fields" });
            return;
        }

        var newPet = {
            _id: null,
            Ime: this.ime.value,
            DatumRodjenja: this.datum.value,
            Rasa: this.rasa.value,
            Tezina: this.tezina.value,
            VrstaPacijentaID: this.vrsta.value,
            VlasnikID: this.props.VlasnikID,
            Aktivan: true,
            Slika: this.state.slikaURL //photo
        };

        await this.props.addNewPet(newPet); // REDUX
    }

    async setPhotoUrl(photo, avatar1) {
        await this.setState({ slikaURL: photo });
    }
 

    render() {

        return (
            <div>
                {this.props.errors.error===true ?
                       <div className="alert alert-dismissible alert-danger">
                       <strong>Oh snap! Somethnig went wrong!</strong> {this.props.errors.error.errorMessage}
                      </div>
                    : ""
                }
                {this.props.petUpdate.errorStatus===null ?
                    <div className="alert alert-dismissible alert-success">
                            <strong>Well done!</strong> You successfully save data.
                    </div>
                    :                 <div>
                    <div className="">
                        <div className="conteiner50procent">
                            Name    <input className="form-control form-control-sm" ref={(ref) => this.ime = ref} type="text" />
                            Date of birth   <input className="form-control form-control-sm" ref={(ref) => this.datum = ref} type="date" />
                            Race             <input className="form-control form-control-sm" ref={(ref) => this.rasa = ref} type="text" />
                            Weight(kg)       <input className="form-control form-control-sm" ref={(ref) => this.tezina = ref} type="number" min="0.5" />
                            Type            <select className="form-control form-control-sm" ref={(ref) => this.vrsta = ref}>
                                <option value="">Choose type of pet</option>
                                {this.state.types.map(opt => { return (<option key={opt._id} value={opt._id}>{opt.Value}</option>); })}
                            </select>
                            <br />
                        </div>
                        <div className="conteiner50procent">
                            <div className="col">
                                <UploadPhoto setPhotoUrl={this.setPhotoUrl} srcPhoto={noimage} />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <button className="btn btn-primary btn-block" onClick={this.addPet}>Save </button>
                    </div>
                }
            </div>
        );
    }
}
//export default PetAdd;  
// REDUX:
const mapStateToProps = state => ({
    errors: state.errors,
    petUpdate:state.pets.petUpdate
  });
  export default connect(mapStateToProps, { addNewPet })(PetAdd);
 