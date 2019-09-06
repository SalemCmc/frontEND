
import React, { Component } from 'react';

import { loadTimeline, getTimelineItemDetails, getPetDetails } from "../WebApis/requestsGraphQL.js";
import { getDayName, getDateString } from '../Utils/DateUtils';

import dijagnoza from '../Icons/dijagnoza.jpg';
import lekovi from '../Icons/lekovi.jpg';
import pregled from '../Icons/pregled.jpg';
//import terapija from '../Icons/terapija.jpg';
import Spinner from '../CommonComponents/Spinner'

class PetDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { petDetail: {}, timeLineList: null, itemDetails: null, row: "0", showRightPanel: false, showPanelAt: ["", "hidde"] };
        this.loadTimeline = this.loadTimeline.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.loadPetDetails = this.loadPetDetails.bind(this);
        this.showPanel = this.showPanel.bind(this);
        this.loadPetDetails();
        this.loadTimeline();
    }
    async loadPetDetails() {


        let D = await getPetDetails(this.props.petID);
        this.setState({ petDetail: D });

    }
    async loadTimeline() {

        let timeItems = await loadTimeline(this.props.petID, "0");
        await this.setState({ timeLineList: timeItems });

    }
    async selectItem(id) {
        this.setState({ itemDetails: null, showRightPanel: true });

        let d = await getTimelineItemDetails(id);
        this.setState({ itemDetails: d });

    }

    showPanel(index) {

        let showPnl = ["hidde", "hidde"];
        showPnl[index] = "";
        this.setState({ showPanelAt: showPnl });
    }


    render() {

        let customAlert = null;
        if (this.state.timeLineList != null && this.state.timeLineList.length < 1) {
            customAlert = <div><br /><div className="alert alert-dismissible alert-warning">
                <strong>Warning!</strong> <br /> This Pet doesn't have any medical service!
                </div></div>
        }
        let timelinePanel = null;
        if (this.state.timeLineList != null && this.state.timeLineList.length > 0) {

            timelinePanel = <div className="leftnavipanel" style={{ height: '500px' }}>

                <h5 className="text-muted">Medical Services Timeline</h5>
                {this.state.timeLineList.map((item) =>
                    <div key={item.id} className="timelineitem" onClick={() => { this.selectItem(item.id) }}>
                        <h5>{getDateString(item.Date)}</h5>
                        <h6 className="text-muted">{getDayName(item.Date) + ' at ' + item.Time + ':00 h'}</h6>
                        <h5>{item.Service}</h5>

                        <br /><br />
                    </div>
                )}
                <center> <button type="button" className="btn btn-link">Load more...</button> </center>
            </div>
        }
        let medicalServiceDetails = null;  // right side, after click on timeline item
        if (this.state.itemDetails !== null) {
            medicalServiceDetails = <div className="custcardmedicalservice">
                <img src={pregled} style={{ width: '100px', margin: 'auto', display: 'block', marginBottom: '10px', marginTop: '10px' }} alt="icon" />

                <h6 className="text-muted">Medical Service Details </h6>
                <hr />
                <h5>  {this.state.itemDetails.Service} </h5>

                <h5 className="text-muted">{this.state.itemDetails.Price + ' KM'}</h5>
                <h5> {getDateString(this.state.itemDetails.Date)}</h5>
                <h6 className="text-muted"> {getDayName(this.state.itemDetails.Date) + ", at " + this.state.itemDetails.Time + ':00 h'}</h6>
                <h5> {this.state.itemDetails.Doctor}</h5>
                <h6 className="text-muted">  {this.state.itemDetails.Description} </h6>
                <br />
            </div>


        }
        let diagnosisDetails = null;  // right side, after click on timeline item
        if (this.state.itemDetails !== null) {
            diagnosisDetails = <div className="custcardmedicalservice">
                <img src={dijagnoza} style={{ width: '100px', margin: 'auto', display: 'block', marginBottom: '10px', marginTop: '10px' }} alt="icon" />
                <h6 className="text-muted">Diagnosis Details </h6>
                <hr />
                {this.state.itemDetails.Diagnosis !== null ?
                    <div>
                        <h5> {this.state.itemDetails.Diagnosis}</h5>
                        <h6 className="text-muted">Therapy Details </h6>
                        <h5> {this.state.itemDetails.Therapy}</h5>
                        <h6 className="text-muted"> {this.state.itemDetails.TherapyDescription} </h6></div>
                    : ""
                }

            </div>

        }
        let medicamentsDetails = null;  // right side, after click on timeline item
        if (this.state.itemDetails !== null) {

            medicamentsDetails = <div className="custcardmedicalservice">
                <img src={lekovi} style={{ width: '100px', margin: 'auto', display: 'block', marginBottom: '10px', marginTop: '10px' }} alt="Loading..." />
                <h6 className="text-muted"> Medicaments Details</h6>
                <hr />
                {this.state.itemDetails.Therapy !== null && this.state.itemDetails.Therapy.Medicaments !== null ?
                    this.state.itemDetails.Medicaments.map((item, index) =>
                        <div key={index}>
                            <h6 className="text-muted"> {'Quantity: ' + item.Quantity}</h6>
                            <h5>  {item.Name} </h5> <br />
                        </div>
                    )
                    : ""
                }
            </div>
        }






        return (
            <div className="" >

                <ul className="nav nav-tabs">
                    <li className="nav-item " onClick={() => { this.showPanel(0) }}><a className="nav-link active " data-toggle="tab" href="#home">Pet Info</a></li>
                    <li className="nav-item " onClick={() => { this.showPanel(1) }}><a className="nav-link " data-toggle="tab" href="#profile">Medical Service History</a></li>
                </ul>

                <div className={this.state.showPanelAt[0]}>
                    <div className="leftnavipanel"> <br />
                        <center>
                            <img className="custimg" src={this.state.petDetail.Slika} alt="petPhoto" style={{ width: '180px', height: '180px' }} />
                            <h6 className="text-muted">Name </h6>
                            <h4>{this.state.petDetail.Ime}</h4>
                            <br />
                        </center>
                    </div>
                    <div className="custcardmedicalservice"> <br />

                        <h6 className="text-muted">Race </h6>
                        <h5> {this.state.petDetail.Rasa} </h5>
                        <h6 className="text-muted">Type of pet </h6>
                        <h5>  {this.state.petDetail.VrstaPacijenta}</h5>
                        <h6 className="text-muted">Weight </h6>
                        <h5>  {this.state.petDetail.Tezina + ' kg'} </h5>
                        <h6 className="text-muted">Date of birth </h6>
                        <h5>  {this.state.petDetail.DatumRodjenja} </h5>

                        <br />
                    </div>
                </div>


                <div className={this.state.showPanelAt[1]}>
                    {customAlert}
                    {this.state.timeLineList === null ?
                        <Spinner />
                        : timelinePanel
                    }
                    {this.state.showRightPanel === true ?
                        <div style={{ width: '68%', float: "left" }} >
                            {this.state.itemDetails === null ? <Spinner />
                                :
                                <div className="col-container">
                                    {medicalServiceDetails}
                                    {diagnosisDetails}
                                    {medicamentsDetails}
                                </div>
                            }
                        </div>
                        : ""}
                </div>






            </div>
        );
    }
}

export default PetDetail;