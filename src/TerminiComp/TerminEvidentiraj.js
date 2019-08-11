import React, { Component } from 'react';
//import { getTerminDetails, getCommonApi,  getPacijentiByVlasnikIDshort, postUsluga } from '../WebApi';
// , postUsluga,postDijagnoza, postTerapija,postLijek, setObavljenTermin koriste se kod .asp.net API
import { EvidentirajTermin, getCommonApi, getPacijentiByVlasnikShort } from "../WebApis/requestsGraphQL.js";
import { Link } from 'react-router-dom';
import dijagnoza from '../Icons/dijagnoza.jpg';
import lekovi from '../Icons/lekovi.jpg';
import pregled from '../Icons/pregled.jpg';


class TerminEvidentiraj extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pacijenti: [], vrsteUsluge: [], lijekovi: [], showPanelAt: ["", "hidde", "hidde"]
            , showMedicamentErrorAlert: false, showErrorAlert: false, showSuccessAlert: false, alertMessage: ""
        };

        this.loadInitialData = this.loadInitialData.bind(this);  // povuci iz baze pacijente i vrste usluge!
        this.loadInitialData();
        this.addLijek = this.addLijek.bind(this);
        this.showPanelByIndex = this.showPanelByIndex.bind(this);
        this.spasiUslugu = this.spasiUslugu.bind(this);
        this.validirajLijek = this.validirajLijek.bind(this);
    }
    async loadInitialData() {

        //console.log("this.props.vlasnikID :", this.props.vlasnikID);
        var VU = await getCommonApi("Usluge");
        //  var TE = await getTerminDetails(this.props.id);
        //  var P = await getPacijentiByVlasnikIDshort(this.props.vlasnikID);
        var P = await getPacijentiByVlasnikShort(this.props.vlasnikID);
        console.log("Vrsta usluge je :", VU);

        this.setState({ pacijenti: P, vrsteUsluge: VU });

    }
    validirajDijagnozu() {
        let valid = true;
        //this.Cijena.className = this.Usluga.className = this.PacijentID.className = this.Anamneza.className = "form-control form-control-sm";
        this.Anamneza.className = "form-control form-control-sm";
        if (this.Terapija.value.length > 0 && this.Anamneza.value.length < 1) {
            this.Anamneza.className = "form-control form-control-sm is-invalid"; valid = false;
        }

        return valid;
    }
    ///  treba povuci termin iz baze i pokupiti mu vlasnika i pacijente....
    async spasiUslugu() {
        //console.log("VRSTA USLUGE:", this.Usluga.value);
        if (!this.validirajUslugu()) {
            let showPnlAt = ["", "hidde", "hidde", "hidde"];
            this.setState({ showPanelAt: showPnlAt });
            return;
        }
        else {
            if (!this.validirajDijagnozu()) {
                let showPnlAt = ["hidde", "", "hidde", "hidde"];
                this.setState({ showPanelAt: showPnlAt });
                return;
            }
        }
        // APIJU ce se slati cijeli objekat koji u sebi ima uslugu, terapiju, dijagnozu i listu lijekova, nakon inserta termin se setuje na obavljen=true;

        let objectForInsert =
        {
            TerminID: this.props.id,
            Dijagnoza: {},
            Terapija: {},
            Usluga: {
                VrstaUslugeID: this.Usluga.value,
                PacijentID: this.PacijentID.value,
                TerminID: "",   // bit ce prazan str, na apiju ce se setovati...
                Cijena: this.Cijena.value,
                Opis: this.OpisUsluge.value,
                Datum: new Date().toString()
            }
        };
        if (this.Anamneza.value !== "") {
            objectForInsert.Dijagnoza = {
                Anamneza: this.Anamneza.value,
                Opis: this.OpisTer.value,
                Datum: new Date().toString()
            }
        }
        if (this.Terapija.value !== "") {
            objectForInsert.Terapija = {
                Naziv: this.Terapija.value,
                Opis: this.OpisTer.value,
                Datum: new Date().toString(),
                Lijekovi: this.state.lijekovi
            }
        }

        // console.log("objekat za insert: ", objectForInsert);


        //postUsluga(objectForInsert);


        EvidentirajTermin(objectForInsert);
        // obavi refresh!

        this.setState({ showSuccessAlert: true, alertMessage: "You successfully save data." });
        this.props.refreshParent();

    }
    validirajUslugu() {
        let valid = true;
        //this.Cijena.className = this.Usluga.className = this.PacijentID.className = this.Anamneza.className = "form-control form-control-sm";
        this.Cijena.className = this.Usluga.className = this.Anamneza.className = "form-control form-control-sm";
        if (this.Cijena.value.length < 1 || this.Usluga.value.length < 1 || this.Pacijent.value.length < 1) {
            this.Cijena.className = this.Usluga.className = this.Pacijent.className = "form-control form-control-sm is-invalid"; valid = false;
        }

        return valid;
    }
    validirajLijek() {
        let valid = true;
        this.setState({ showMedicamentErrorAlert: false });
        if (this.Anamneza.value.length < 1 || this.Terapija.value.length < 1) {
            //alert("Nije moguće dodati lijek dok se ne unese terapija i dijagnoza");
            this.setState({ showMedicamentErrorAlert: true });
            valid = false;
        }
        this.Lijek.className = this.Kolicina.className = "form-control form-control-sm";
        if (this.Lijek.value.length < 1) {
            this.Lijek.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        if (this.Kolicina.value.length < 1) {
            this.Kolicina.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        return valid;
    }
    addLijek() {
        if (!this.validirajLijek()) { return; }
        var newLijek = {
            Naziv: this.Lijek.value,
            Kolicina: this.Kolicina.value,
            Uputa: this.Upustvo.value

        };
        this.Lijek.value = this.Upustvo.value = this.Kolicina.value = "";
        var listLek = this.state.lijekovi;
        listLek.push(newLijek);
        this.setState({ lijekovi: listLek });
        //console.log("lekovi su :", this.state.lijekovi);
    }
    ukloniLijek(index) {
        var listLek = this.state.lijekovi;
        listLek.splice(index, 1);
        this.setState({ lijekovi: listLek });
    }
    showPanelByIndex(index) {

        let showPnlAt = ["hidde", "hidde", "hidde"];
        showPnlAt[index] = "";
      
        this.setState({ showPanelAt: showPnlAt });
    }

    render() {

        let medicalServicePanel = null;
        let diagnosisTherapyPanel = null;
        let medicamentsPanel = null;

        // medicalServicePanel = this.state.showPanelAt[0];
        medicalServicePanel =
            <div className={this.state.showPanelAt[0]}>
                  <img src={pregled} style={{ width: '50px', margin: 'auto', display: 'block', marginBottom: '10px', marginTop: '10px' }} alt="icon" />
               <center> <h5 className="text-muted">Medical service</h5></center>  
                <div className="breadcrumb">
                   
                    Pet *
                <select className="form-control form-control-sm" ref={(ref) => this.Pacijent = ref}>
                        <option value="">choose pet</option>
                        {this.state.pacijenti.map(opt => { return (<option ref={(ref) => this.PacijentID = ref} key={opt._id} value={opt._id}>{opt.Ime}</option>); })}
                    </select>
                    Type of medical service * 
                <select className="form-control form-control-sm" ref={(ref) => this.Usluga = ref}>
                        <option value="">choose type</option>
                        {this.state.vrsteUsluge.map(opt => { return (<option  key={opt._id} value={opt._id}>{opt.Value}</option>); })}
                    </select>
                    Price *
                <input className="form-control form-control-sm" ref={(ref) => this.Cijena = ref} placeholder="price (KM)" type="number" min="0" />
                    Description
                <textarea className="form-control form-control-sm" rows="4" ref={(ref) => this.OpisUsluge = ref} placeholder="Opis usluge" type="text" />
                </div><br /> </div>
        // diagnosisPanel = this.state.showPanelAt[1];
        diagnosisTherapyPanel =
            <div className={this.state.showPanelAt[1]}   >
               
                <img src={dijagnoza} style={{ width: '50px', margin: 'auto', display: 'block', marginBottom: '10px', marginTop: '10px' }} alt="icon" />
               <center> <h5 className="text-muted">Diagnosis and Therapy</h5></center> 
               <div className="breadcrumb">  
                    Anamnesis/ Diagnosis Description
                <textarea className="form-control form-control-sm" rows="5" ref={(ref) => this.Anamneza = ref} placeholder="anamnesis" type="text" />
               Therapy
                <input className="form-control form-control-sm" ref={(ref) => this.Terapija = ref} placeholder="herapy" type="text" />
                    Therapy Description
                <textarea className="form-control form-control-sm" rows="3" ref={(ref) => this.OpisTer = ref} placeholder="description" type="text" />
                </div> </div>

        // medicamentsPanel = this.state.showPanelAt[3];
        medicamentsPanel =
            <div className={this.state.showPanelAt[2]}>
               <img src={lekovi} style={{ width: '50px', margin: 'auto', display: 'block', marginBottom: '10px', marginTop: '10px' }} alt="icon" />
               <center> <h5 className="text-muted">Medicaments</h5></center>  
                {this.state.showMedicamentErrorAlert === true ?
                    <div className="alert alert-dismissible alert-danger">
                        <strong>Oh snap!</strong> Diagnosis and Therapy are required, if you want to add Medicament!
                                    </div>
                    : ""}
                <div className="breadcrumb">  
                    Medicament*
                <input className="form-control form-control-sm" ref={(ref) => this.Lijek = ref} placeholder="txt" type="text" />
                    Quantity*
                    <input className="form-control form-control-sm" ref={(ref) => this.Kolicina = ref} placeholder="number" type="number" min="1" />

                    Instructions for use
                    <textarea className="form-control form-control-sm" rows="3" ref={(ref) => this.Upustvo = ref} placeholder="txt" type="text" />
                    <button type="submit" className="badge badge-primary" onClick={this.addLijek} >Add Medicament</button>
                    <br />
                    <hr />
                    <br />
                    <table className="table table-sm">
                        <thead><tr ></tr>
                        </thead>
                        <tbody>
                            {this.state.lijekovi.map((item, index) =>
                                <tr key={index}>
                                    <td>{item.Naziv}</td>
                                    <td>{item.Kolicina}</td>
                                    <td>
                                        <Link to="#" className="text-danger" onClick={() => { this.ukloniLijek(index) }} ><b>remove</b></Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div> <br />
            </div>




        return (
            <div className="" >
                {this.state.showSuccessAlert === true ?
                    <div className="alert alert-dismissible alert-success">
                        <strong>Well done!</strong> {this.state.alertMessage}
                    </div>
                    :
                    <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item " onClick={this.showPanelByIndex.bind(this, 0)}><a className="nav-link active " data-toggle="tab" href="#home">Medical Service *</a></li>
                    <li className="nav-item " onClick={this.showPanelByIndex.bind(this, 1)}><a className="nav-link " data-toggle="tab" href="#profile">Diagnosis and Therapy </a></li>
                    <li className="nav-item " onClick={this.showPanelByIndex.bind(this, 2)}><a className="nav-link " data-toggle="tab" href="#profile">Medicaments</a></li>
                </ul>

{medicalServicePanel} 
 {diagnosisTherapyPanel}

 {medicamentsPanel}

                        <hr />
                        <button type="submit" className="btn btn-primary btn-block" onClick={this.spasiUslugu} >Save</button>
                    </div>}
                {this.state.showErrorAlert === true ?
                    <div className="alert alert-dismissible alert-danger">
                        <strong>Oh snap!</strong> {this.state.alertMessage}
                    </div>
                    : ""}


            </div>
        );
    }
}
//Modal.propTypes = {  onClose: PropTypes.func.isRequired,  show: PropTypes.bool,  children: PropTypes.node};
export default TerminEvidentiraj;