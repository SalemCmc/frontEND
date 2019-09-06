
import React, { Component } from 'react';

import { getCommonApi, postPet } from "../WebApis/requestsGraphQL.js";

import UploadPhoto from '../CommonComponents/UploadPhoto';

class PetAdd extends Component {
    constructor(props) {
        super(props);
        this.state = { slikaURL: "", types: [], showSuccessAlert: false, showErrorAlert: false, alertMessage: "" };

        this.setPhotoUrl = this.setPhotoUrl.bind(this);
        this.addPet = this.addPet.bind(this);
        this.validiraj = this.validiraj.bind(this);
        this.getPetType = this.getPetType.bind(this);
        this.closeAlerts = this.closeAlerts.bind(this);
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
        // this.setState({ slikaURL: null, showSuccessAlert: false, showErrorAlert: false });
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
            Slika: this.state.slikaURL //slika
        };


        let Resp = await postPet(newPet);


        if (Resp.errorStatus === true) {
            console.log("SAVE PET IF: ", Resp);
            await this.setState({ showErrorAlert: true, alertMessage: Resp.errorStatus });
        }
        else {
            console.log("SAVE PET ELSE: ", Resp);
            this.cleanFields();

            await this.setState({ slikaURL: "", showErrorAlert: false, showSuccessAlert: true, alertMessage: "You successfully save data." });
            this.props.refreshParent();
        }
    }
    async setPhotoUrl(photo, avatar1) {

        await this.setState({ slikaURL: photo });


    }
    closeAlerts() {
        this.setState({ showErrorAlert: false, showSuccessAlert: false, alertMessage: "" });
    }





    render() {
        console.log("STATE: ", this.state);

        return (
            <div>

                {this.state.showSuccessAlert === true ?
                    <div className="alert alert-dismissible alert-success">

                        <strong>Well done!</strong> {this.state.alertMessage}
                    </div>
                    : ""}
                {this.state.showErrorAlert === true ?
                    <div className="alert alert-dismissible alert-danger">

                        <strong>Oh snap!</strong> {this.state.alertMessage}
                    </div>
                    : ""}



                <div className="row">
                    <div className="col-sm-6">
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

                    <div className="col-sm-6">
                        <div className="col">
                            <UploadPhoto setPhotoUrl={this.setPhotoUrl} srcPhoto={this.state.slikaURL} />
                        </div>


                    </div>
                </div>


                <hr />
                <button className="btn btn-primary btn-block" onClick={this.addPet}>Save </button>
            </div>
        );
    }
}

export default PetAdd;