import React, { Component } from "react";

class Search extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.refresh = this.refresh.bind(this);

  }
  componentDidMount() {
  
    let params = this.props.searchParams;
    if (params !== undefined) {

      if (params.searchString !== undefined) {
        this.SearchString.value = params.searchString;
      }
      if (params.searchDate !== undefined) {
        this.SearchDate.value = params.searchDate;
      }

      if (params.role !== undefined) {
        if (params.role === "Client") {
          this.rdbClients.checked = true;
        }
        else {
          this.rdbEmployees.checked = true;
        }
      }
      if (params.active !== undefined) {
        this.SearchCheck.checked = false;
        if (params.active === true) {
          this.SearchCheck.checked = true;
        }

      }


    }
  }

  search() {

    let searchString = " ";
    let searchDate = " ";
    let searchCheck = " ";
    let searchRadio = " ";

    if (this.props.sstring === "true") { searchString = this.SearchString.value; }
    if (this.props.sradio === "true" && this.rdbClients.checked === true) { searchRadio = "Client"; }
    else { searchRadio = "Osoblje"; }
    if (this.props.scheck === "true") { searchCheck = this.SearchCheck.checked; }
    if (this.props.sdate === "true") { searchDate = this.SearchDate.value; }

    this.props.search(searchString, searchDate, searchCheck, searchRadio);
  }
  refresh(event) {

    if (this.props.sstring === "true") this.SearchString.value = "";
    if (this.props.sdate === "true") this.SearchDate.value = "";
    if (this.props.sradio === "true") { this.rdbClients.checked = true; this.rdbEmployees.checked = false; }
    if (this.props.scheck === "true") this.SearchCheck.checked = true;
    this.props.search(" ", "", true, "Client");
  }

  render() {
    // console.log("this.props.onlyString", this.props.onlyString);
    var dateInput = null; var stringInput = null;
    var radioInput = null; var checkBoxInput = null;
    if (this.props.sdate === "true") {
      dateInput = (<div> <input className="form-control form-control-sm" ref={ref => (this.SearchDate = ref)}
        placeholder="Datum" type="date" />   &emsp; </div>);
    }
    if (this.props.scheck === "true") {
      checkBoxInput = (<div> <input type="checkbox" defaultChecked="false" ref={ref => (this.SearchCheck = ref)} /> Active  &emsp;</div>);
    }
    if (this.props.sradio === "true") {
      radioInput = (<div>  <input type="radio" name="typeUser" defaultChecked="checked" ref={ref => (this.rdbClients = ref)} /> Clients     &emsp;
                            <input type="radio" name="typeUser" ref={ref => (this.rdbEmployees = ref)} /> Employees    &emsp;</div>);
    }
    if (this.props.sstring === "true") {
      stringInput = (<div><input className="form-control form-control-sm" ref={ref => (this.SearchString = ref)}
        placeholder="txt" type="text" />  &emsp;</div>);
    }

    return (
      <div className="floatright">
        <div className="form-inline">
          <button className="btn btn-outline-primary btn-sm" onClick={this.refresh}  >Refresh</button>
          &emsp;
          {stringInput}
          {dateInput}
          {checkBoxInput}
          {radioInput}
          <button className="btn btn-primary btn-sm" onClick={this.search}> Search</button>
        </div>
      </div>

    );
  }
}

export default Search;
