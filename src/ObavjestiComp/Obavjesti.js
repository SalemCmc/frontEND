import React, { Component } from "react";
import Search from "../Search";
//import { getObavjesti, changeStatusObavjest } from "../WebApi";
import { Link } from "react-router-dom";
import Modal from '../Modal';
import Pagination from "react-js-pagination";
import Confirm from "../CommonComponents/Confirm"
import ObavjestiAdd from "./ObavjestiAdd";
import { connect } from 'react-redux';
import { getObavjestiGR, deleteObavjest } from "../WebApis/requestsGraphQL.js";

class Obavjesti extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Obavjesti: [], Count: 0, row: 0, limit: 4, searchString: " ",
      searchDate: " ", showModal: false, deleteID: null, modalTitle: "", modalChild: null,
    };
    this.getObavjest = this.getObavjest.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    //this.getObavjest();
    this.handlePageChange = this.handlePageChange.bind(this);
    this.searchObavjest = this.searchObavjest.bind(this);
    this.handleModal = this.handleModal.bind(this);

    this.removeItemModal = this.removeItemModal.bind(this);
    this.addNewItemtModal = this.addNewItemtModal.bind(this);

  }


  componentDidMount()  // potrebno jer kad se radi redirect da se reload-a komponenta.
  {
    this.getObavjest();

  }
  async searchObavjest(sstring, sdate)// poziva se iz komponente search i vraca 2 param!
  {
    await this.setState({ searchString: sstring, searchDate: sdate, row: 0 });
    this.getObavjest();
  }
  async getObavjest() {  //console.log("okinut LOAD!");
    // load iz baze podataka---
    //let obav1 = await getObavjesti(this.state.searchString, this.state.searchDate,      this.state.row, this.state.limit);   
    let obav = await getObavjestiGR(this.state.searchString, this.state.searchDate, this.state.row, this.state.limit);

    this.setState({ Obavjesti: obav.items, Count: obav.count, show: false });
  }
  async handlePageChange(pageNumber) {
    let br = (pageNumber - 1) * this.state.limit;
    //console.log(br);
    await this.setState({ row: br, pn: pageNumber });
    this.getObavjest();
  }

  async changeStatus() {
    //let resp = await changeStatusObavjest(this.state.deleteID);  deleteObavjest
    let resp = await deleteObavjest(this.state.deleteID);
    if (resp === true) {
      //this.getObavjest();
      this.handleModal();
    }

  }
  async handleModal() {
    await this.setState({ showModal: !this.state.showModal });
    //after save and closing modal do refresh- load new item
    if (this.state.showModal === false) {
      this.searchObavjest("", "");
    }
  }
  addNewItemtModal() {
    let childModal = <ObavjestiAdd />
    this.setState({ showModal: !this.state.showModal, modalTitle: "Add Notification", modalChild: childModal });
  }
  removeItemModal(ID) {
    let childModal = <Confirm confirmClick={this.changeStatus} hide={this.handleModal} message="Are you sure you want delete this item?" />
    this.setState({ showModal: !this.state.showModal, modalTitle: "Confirm", modalChild: childModal, deleteID: ID });
  }

  render() {   //console.log("PROPS OBAVJESTI-this.props.auth.: ", this.props.auth);
    //const { Obavjesti } = this.state;
    let hrefLink = '#';   /// naci drugi nacin!
    return (

      <div className="">

        <div>
          <Modal show={this.state.showModal} handleClose={this.handleModal} title={this.state.modalTitle} >
            {this.state.modalChild}
          </Modal>
        </div>

        <div className="custtitlebox">
          <Search search={this.searchObavjest} sstring="true" sdate="true" scheck="false" sradio="false" />
          <h4 >Notifications</h4>
          {this.props.auth.user.rola === "Admin" || this.props.auth.user.rola === "Doktor" ?

            <Link to="#" onClick={this.addNewItemtModal} >Add Notification</Link> : null}
        </div>

        {this.state.Obavjesti.map(item => (
          <div key={item.ID}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{item.Naslov}</h4>
                <h6 className="card-subtitle mb-2 text-muted">
                  Published by {item.Kreirao}  -  Published at {item.Datum}
                </h6>
                <p className="card-text">{item.Sadrzaj}</p>

                {this.props.auth.user.rola === "Admin" || this.props.auth.user.rola === "Doktor" ?
                  <a href={hrefLink} className="card-link" onClick={() => { this.removeItemModal(item.ID) }} > remove </a>
                  : null
                }

              </div>
            </div>

          </div>
        ))}
        <div className="custpaging">
          <Pagination activePage={this.state.pn} itemsCountPerPage={5} onChange={this.handlePageChange}
            totalItemsCount={this.state.Count} pageRangeDisplayed={10} innerClass="btn-group mr-2" itemClass="btn btn-outline-primary btn-sm" itemClassFirst="page-item"
            linkClass="" activeLinkClass="" activeClass="page-item active" disabledClass="text-secondary" firstPageText="first" lastPageText="last" nextPageText=">" prevPageText="<"
          />
        </div></div>
    );
  }
}

//export default Obavjesti;
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Obavjesti);
