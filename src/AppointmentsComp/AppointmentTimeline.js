

import React, { Component } from 'react';
import { getAppointments, getMedicServices } from "../WebApis/requestsGraphQL.js";
import { getDayName, getDateString } from '../Utils/DateUtils';
import Spinner from '../CommonComponents/Spinner'
class AppointmentTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = { Korisnik: {}, timeLineList: [], loading: true };
        this.loadTimeline = this.loadTimeline.bind(this);
        this.loadTimeline();
    }
    async loadTimeline() {
        this.setState({ loading: true });   // OVO NIJE OK!!!            TREBA ISPRAVITI!!!
        var listPrva = this.state.timeLineList;
        var listDruga = [];
        if (this.props.type === "APPOINTMENTS") {
            listDruga = await getAppointments(this.props.id, this.state.timeLineList.length.toString());
        } else {
            listDruga = await getMedicServices(this.props.id, this.state.timeLineList.length.toString());
        }


        var listMerg = listPrva.concat(listDruga);
        this.setState({ timeLineList: listMerg, loading: false });
    }



    render() {
        let timeline = null;
        if (this.props.type === "APPOINTMENTS") {
            timeline =
                <div className="leftnavitem">
                    <center> <h5 className="text-muted">Appointments Timeline</h5></center>

                    <div>
                        <div className="timelineconteiner">
                            {this.state.timeLineList.map((item, index) =>
                                <div key={item.id} onClick={() => { this.props.onClick("TIMELINEDETAIL", item.id) }}>
                                    {(index === 0 && item.Done === true) ? <h5 className="text-muted">&nbsp; Done </h5> : ""}
                                    {(index === 0 && item.Done === false) ? <h5 className="text-muted"> &nbsp; Incoming </h5> : ""}
                                    {(index !== 0 && this.state.timeLineList[index - 1].Done === false && item.Done === true) ? <h5 className="text-muted">&nbsp; Done </h5> : ""}

                                    <div className={item.Done === false ? "timelineitem" : "timelineitemdone"} >
                                        {item.ClientID === this.props.id ? <h6>Appointment with <b>{'Dr. ' + item.Doctor}</b></h6> : <h6>Appointment with <b> {item.Client}</b></h6>}
                                        <h5 className="text-muted">{getDateString(item.Date)}</h5>
                                        <h6 className="text-muted">{getDayName(item.Date) + ' at ' + item.Time + ':00 h'}</h6>
                                    </div></div>
                            )}


                            {this.state.loading === false && (this.state.timeLineList != null && this.state.timeLineList.length < 1) ? <p class="text-warning">No active appointments.</p> : ""}

                            {this.state.loading === true ? <Spinner /> : ""}
                        </div>
                        <center> <button type="button" className="btn btn-link" onClick={this.loadTimeline}>Load more...</button> </center>
                    </div>

                </div>;
        } else {

            timeline = <div>

                {this.state.loading === false && (this.state.timeLineList != null && this.state.timeLineList.length < 1) ?
                    <div><br />   <div className="alert alert-dismissible alert-warning">
                        <strong>Warning!</strong> <br /> This Pet doesn't have any medical service!
                   </div>   </div>
                    :
                    <div className="conteiner33">
                        <center className="text-muted">Medical Services Timeline</center>
                        <hr />
                        {this.state.timeLineList.map((item) =>
                            <div key={item.id} className="timelineitem" onClick={() => { this.props.onClick(item.id) }}>
                                <h6>{getDateString(item.Date)}</h6>
                                <h6 className="text-muted">{getDayName(item.Date) + ' at ' + item.Time + ':00 h'}</h6>
                                <h6>{item.Service}</h6>
                            </div>
                        )}
                        {this.state.loading === true ? <Spinner /> : ""}
                        <center> <button type="button" className="btn btn-link" onClick={this.loadTimeline} >Load more...</button> </center>
                    </div>
                }</div>;


        }


        return (

            <div>


                {timeline}


            </div>




        );
    }
}
export default AppointmentTimeline;