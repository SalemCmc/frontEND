import React, { Component } from "react";
import { Link } from "react-router-dom";
// sub component
import NotificationAdd from "./NotificationAdd";
// common components:
import Spinner from '../CommonComponents/Spinner'
import Error from '../CommonComponents/Error'
import Search from "../CommonComponents/Search";
import Modal from "../CommonComponents/Modal";
import Pagination from "react-js-pagination";
import Confirm from "../CommonComponents/Confirm"
// REDUX:
import { connect } from 'react-redux';
import { getNotifications, deleteNotification } from '../actions/notificationActions';

//import { getObavjestiGR, deleteObavjest } from "../WebApis/requestsGraphQL.js";



class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      row: 0, limit: 4, searchString: " ",
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


  componentDidMount() {

    if (this.props.history.action === "POP" && this.props.notifications.items.length > 0 && this.props.notifications.searchParams !== {}) {
      //  console.log(" B A C K!"); // do nothing!  FIX LATER...
    }
    else {
      // console.log("NOT B A C K!");
      if (this.props.notifications.items.length < 1) {
        this.setState({ searchDate: "", searchString: "", row: 0, pn: 1 });
        this.getObavjest();
      }
    }
  }


  async searchObavjest(sstring, sdate) {
    await this.setState({ searchString: sstring, searchDate: sdate, row: 0, pn: 1 });
    this.getObavjest();
  }
  async getObavjest() {

    let searchParam = {};
    searchParam.searchString = this.state.searchString;
    searchParam.searchDate = this.state.searchDate;
    searchParam.row = this.state.row;
    searchParam.limit = this.state.limit;
    searchParam.pageNumber = this.state.pn;

    await this.props.getNotifications(searchParam);  // load from DB and insert in the store (redux)

  }
  async handlePageChange(pageNumber) {
    let br = (pageNumber - 1) * this.state.limit;
    await this.setState({ row: br, pn: pageNumber });
    this.getObavjest();
  }

  async changeStatus() {
    await this.props.deleteNotification(this.state.deleteID);
    this.handleModal();
  }
  async handleModal() {
    await this.setState({ showModal: !this.state.showModal });
  }
  addNewItemtModal() {
    let childModal = <NotificationAdd />
    this.setState({ showModal: !this.state.showModal, modalTitle: "Add Notification", modalChild: childModal });

  }
  removeItemModal(ID) {
    let childModal = <Confirm confirmClick={this.changeStatus} hide={this.handleModal} message="Are you sure you want delete this item?" />
    this.setState({ showModal: !this.state.showModal, modalTitle: "Confirm", modalChild: childModal, deleteID: ID });
  }

  render() {


    return (

      <div className="">

        <Modal show={this.state.showModal} handleClose={this.handleModal} title={this.state.modalTitle} >
          {this.state.modalChild}
        </Modal>

        <div className="custtitlebox">
          <Search search={this.searchObavjest} searchParams={this.props.notifications.searchParams} sstring="true" sdate="true" scheck="false" sradio="false" />
          <h4 className="text-muted" >Notifications</h4>
          {this.props.auth.user.rola === "Admin" || this.props.auth.user.rola === "Doctor" ?
            <Link to="#" className="card-link" onClick={this.addNewItemtModal} > Add Notification </Link>
            : null}
        </div>
        <div className="custcontent">
        {this.props.errors.error === true ?
          <Error message={this.props.errors.errorMessage.toString()} />
          : null}
        {this.props.notifications.loading === true ?
          <Spinner />
          :

          this.props.notifications.items.map(item => (
            <div className="custbodyconttent" key={item.ID}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">{item.Naslov}</h4>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Published by {item.Kreirao}  -  Published at {item.Datum}
                  </h6>
                  <p className="card-text">{item.Sadrzaj}</p>

                  {this.props.auth.user.rola === "Admin" || this.props.auth.user.rola === "Doctor" ?
                    <Link to="#" className="card-link" onClick={() => { this.removeItemModal(item.ID) }} > remove </Link>

                    : null
                  }

                </div>
              </div>

            </div>
          ))

        }


</div>
        <div className="custpaging">
          <Pagination activePage={this.props.notifications.searchParams.pageNumber} itemsCountPerPage={5} onChange={this.handlePageChange}
            totalItemsCount={this.props.notifications.count} pageRangeDisplayed={10} innerClass="btn-group mr-2" itemClass="btn btn-outline-primary btn-sm" itemClassFirst="page-item"
            linkClass="" activeLinkClass="" activeClass="page-item active" disabledClass="text-secondary" firstPageText="first" lastPageText="last" nextPageText=">" prevPageText="<"
          />
        </div></div>
    );
  }
}

//export default Notifications;
const mapStateToProps = state => ({
  auth: state.auth,
  notifications: state.notifications,
  errors: state.errors
});

export default connect(mapStateToProps, { getNotifications, deleteNotification })(Notifications);
