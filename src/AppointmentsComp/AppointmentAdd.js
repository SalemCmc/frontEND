
import React, { Component } from 'react';
import { getKorisniciShort, getFreeAppointmentTime } from "../WebApis/requestsGraphQL.js";
import Spinner from '../CommonComponents/Spinner'

// REDUX:getAppointmentsByDoctor
import { connect } from 'react-redux';
import { addAppointment, setAppointmentsAddSuccess } from '../actions/appointmentsActions';
import { getUsersShort } from '../actions/usersActions';



class AppointmentAdd extends Component {
    constructor(props) {
        super(props);
        let korID = this.props.idKlijent;
        this.state = { Korisnici: [], selectedKorisnik: "", selectedKorisnikID: korID, sati: [], timeMessage: null, selectedTime: null, errorMsg: null };

        this.getKorisnici = this.getKorisnici.bind(this);

        this.selectKorisnik = this.selectKorisnik.bind(this);
        this.selectTime = this.selectTime.bind(this);
        this.spasiTermin = this.spasiTermin.bind(this);
        this.validiraj = this.validiraj.bind(this);

        this.getFreeAppointmentTime = this.getFreeAppointmentTime.bind(this);

    }

    componentDidMount() {
        if (this.props.usersShortList.length < 1) {
            this.props.getUsersShort(' ', "Doctor");
        }
        this.props.setAppointmentsAddSuccess(false);
    }


    async getKorisnici() {    // POSLIJE PREBACI NA REDUX!

        // if (this.SearchString.value.length > 1) {
        let kor = await getKorisniciShort(this.SearchString.value, "Client");
        this.setState({ Korisnici: kor });
        // }
    }
    selectKorisnik(id, naziv) {
        this.setState({ selectedKorisnikID: id, selectedKorisnik: naziv })

    }
    validiraj() {

        var valid = true;
        this.Doktor.className = this.Datum.className = "form-control form-control-sm";
        this.Time.className = "";
        if (this.props.idKlijent === null) {
            this.Korisnik.className = "form-control form-control-sm";
        }

        if (this.state.selectedKorisnikID === null && this.props.idKlijent === null) {
            this.Korisnik.className = "form-control form-control-sm is-invalid"; valid = false;
        }

        if (this.Datum.value === "") {
            this.Datum.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        if (this.Doktor.value.length < 1) {
            this.Doktor.className = "form-control form-control-sm is-invalid"; valid = false;
        }
        if (this.state.selectedTime === null) {
            this.Time.className = "text-danger"; valid = false;
        }

        var day = new Date(this.Datum.value).getDay();

        if ((day === 6) || (day === 0)) {
            //alert("Subotom i nedeljom ordinacija ne radi, odaberite drugi dan!");
            this.setState({ errorMsg: "We don't work at weekends, please choose another day." });

            this.Datum.className = "form-control form-control-sm is-invalid"; valid = false;
        }

        var date1 = new Date(this.Datum.value);
        var date2 = new Date();
        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);

        if (date1 < date2) {
            //alert("Datum mora biti veci ili današnji!");
            this.setState({ errorMsg: "You can't book in past, please choose valid date" });
            this.Datum.className = "form-control form-control-sm is-invalid"; valid = false;
        }

        return valid;
    }
    async spasiTermin() {

        this.setState({ errorMsg: null });
        if (!this.validiraj()) { return; }

        var newTermin = {

            VlasnikID: this.state.selectedKorisnikID,
            DoktorID: this.Doktor.value,
            Napomena: this.Napomena.value,
            Datum: this.Datum.value,
            Vrijeme: this.state.selectedTime,
            Aktivan: true,
            Obavljen: false
        };

        let type = "Client";
        if (this.props.idKlijent === null) {
            type = "Doctor";
        }
        await this.props.addAppointment(newTermin, type);


    }

    async  getFreeAppointmentTime() {

        if (this.Doktor.value !== "" && this.Datum.value.toString() !== "") {

            let tm = <p>Available Time</p>;

            this.setState({ sati: null, timeMessage: tm, selectedTime: null });
            let doctorID = this.Doktor.value;
            let date = this.Datum.value.toString();

            let freeHour = await getFreeAppointmentTime(doctorID, date);
            if (freeHour.length < 1) {
                tm = <p className="text-danger">Doctor is not avialable on this date!</p>
            }
            this.setState({ sati: freeHour, timeMessage: tm });
        }
    }
    selectTime(hour) {

        this.setState({ selectedTime: hour });
    }
    render() {


        let customAlert = null;
        if (this.state.errorMsg !== null) {
            customAlert = <div className="alert alert-dismissible alert-danger">
                <strong>Warning!</strong> <br /> {this.state.errorMsg}
            </div>
        }
        if (this.props.errors.error === true) {
            customAlert = <div className="alert alert-dismissible alert-danger">
                <strong>Warning!</strong> <br /> {this.state.errorMsg}
            </div>
        }



        return (
            <div >
                {this.props.success === true ? <div className="alert alert-dismissible alert-success"><strong>Appointment saved successflly!</strong>   </div>
                    :

                    <div className="" >
                        {customAlert}
                        <div className="row">
                            {this.props.idKlijent === null ?
                                <div className="col-sm-4">
                                    Client
                            <input className="form-control form-control-sm" ref={(ref) => this.Korisnik = ref}
                                        defaultValue={this.state.selectedKorisnik} placeholder="You didn't choose client!" type="text" readOnly />

                                    Search clients
                            <input className="form-control form-control-sm" ref={(ref) => this.SearchString = ref} placeholder="name or lastaname" type="text" onChange={this.getKorisnici} />
                                    <br />
                                    <table className="table table-sm table-bordered table-hover">
                                        <tbody>{this.state.Korisnici.map((item, index) =>
                                            <tr key={index}>
                                                <th>
                                                    <button type="button" className="btn btn-link btn-sm" onClick={() => this.selectKorisnik(item._id, item.Ime + ' ' + item.Prezime)}>{item.Ime + ' ' + item.Prezime}</button>
                                                </th></tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                                : ""}

                            <div className="col-sm-4">

                                Doctor
                        <select className="form-control form-control-sm" ref={(ref) => this.Doktor = ref} onChange={this.getFreeAppointmentTime}>
                                    <option value=""  >Choose doctor</option>
                                    {this.props.usersShortList.map(opt => { return (<option key={opt._id} ref={(ref) => this.DoktorID = ref} value={opt._id}>{opt.Ime + ' ' + opt.Prezime}</option>); })}
                                </select>
                                Date
                        <input className="form-control form-control-sm" onChange={this.getFreeAppointmentTime} ref={(ref) => this.Datum = ref} placeholder="Date" type="date" />
                                <br />
                                {this.state.sati === null ?
                                    <div>   <br /><Spinner /><center className="text-success">Loading Avialible Time...</center></div>
                                    :
                                    <div ref={(ref) => this.Time = ref}> {this.state.timeMessage}
                                        {this.state.sati.map((item, index) =>
                                            <div key={index} style={{ float: "left", marginLeft: "10px", width: "40%" }} >
                                                <input type="radio" name="time" onClick={() => { this.selectTime(item) }} />
                                                <span className="text-success">   {'   ' + item + ' : 00'}</span>
                                            </div>
                                        )}</div>
                                }

                            </div>


                            <div className="col-sm-4">
                                Additional information
                        <textarea className="form-control form-control-sm" rows="4" ref={(ref) => this.Napomena = ref} placeholder="Aditional information" type="text" />

                            </div>
                        </div>
                        <hr />
                        <button type="submit" className="btn btn-primary btn-block" onClick={this.spasiTermin} disabled={this.props.success}  >Save</button>
                    </div>}
            </div>
        );
    }
}
//export default AppointmentAdd;
const mapStateToProps = state => ({
    errors: state.errors,
    success: state.appointments.succesPost,
    usersShortList: state.users.usersShortList
});

export default connect(mapStateToProps, { addAppointment, setAppointmentsAddSuccess, getUsersShort })(AppointmentAdd);