

import React, { Component } from 'react';
import Search from '../CommonComponents/Search';

import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import Spinner from '../CommonComponents/Spinner'
import Error from '../CommonComponents/Error'
// REDUX:
import { connect } from 'react-redux';
import { getUsers } from '../actions/usersActions';

//import { getKorisnici } from "../WebApis/requestsGraphQL.js";

class UsersPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { KorisniciList: [], Count: 0, rola: "Client", row: 0, aktivni: true, limit: 4, searchString: " ", pn: 1 };
    this.getKorisnici = this.getKorisnici.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.search = this.search.bind(this);
    // this.getKorisnici(" ", "");

  }

  componentDidMount()  // potrebno jer kad se radi redirect da se reload-a komponenta.
  {
    // console.log("componentDidMount USERI: ", this.props.users);
    if (this.props.history.action === "POP" && this.props.users.items.length > 0 && this.props.users.searchParams !== {}) {
      //console.log(" B A C K!"); // do nothing!

    }
    else {
      // console.log("NOT B A C K!");
      if (this.props.users.items.length < 1) {
        this.setState({ searchDate: "", searchString: "", row: 0, pn: 1 });
        this.getKorisnici();
      }
    }
  }

  async  search(searchString, searchDate, searchCheck, searchRadio) {
    // funkcija pozvana iz componente search ! salje 4 parametra, pa se uzimaju koji trebaju ovoj komponenti!
    // recimo datum nije potreban u ovom slucaju, ali ga salje search componenta
    await this.setState({ searchString: searchString, row: 0, aktivni: searchCheck, rola: searchRadio });
    this.getKorisnici();
  }
  async getKorisnici() {

    let searchParams = {};
    searchParams.searchString = this.state.searchString;
    searchParams.role = this.state.rola;
    searchParams.active = this.state.aktivni;
    searchParams.row = this.state.row;
    searchParams.limit = this.state.limit;
    searchParams.pageNumber = this.state.pn;


    await this.props.getUsers(searchParams);

    //  console.log("SA FORME USERI getKorisnici: ", this.props.users);


  }
  async handlePageChange(pageNumber) {
    let br = (pageNumber - 1) * this.state.limit;
    //console.log(br);
    await this.setState({ row: br, KorisniciList: [], pn: pageNumber });
    this.getKorisnici();
  }



  render() {
    //const { Korisnici } = this.state;

    return (  //     <li className="page-item"><a className="page-link" href="#">PRVAAA</a></li>
      <div >
        <div className="custtitlebox">
          <Search search={this.search} searchParams={this.props.users.searchParams} sstring="true" sdate="false" scheck="true" sradio="true" />
          <h4 >Clients and Employees</h4>
          <Link to="/UserAdd/registration">Add new user</Link>
        </div>


        {this.props.errors.error === true ?
          <Error message={this.props.errors.errorMessage.toString()} />
          : null}
        {this.props.users.loading === true ?
          <Spinner />
          :
          this.props.users.items.map(item =>

            <div className="custcard" key={item._id}>
              <div className="cardphoto">
                <img src={item.Slika} alt="John" style={{ height: "100%", width: "100%", borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }} />
              </div>
              <h4>{item.Ime + " " + item.Prezime}</h4>
              {item.Aktivan === true ? ""
                : <h6 className="text-danger"><b><span role="img" aria-label=""> &#9940; &nbsp;</span>
                  NON ACTIVE</b></h6>}
              <hr />

              <p>  <span role="img" aria-label="nn">&#x260E; &nbsp;</span> {item.Telefon}</p>
              <p>  <span role="img" aria-label="nn">&#x2709; &nbsp; </span> {item.Email}</p>
              <p>  <span role="img" aria-label="nn">&#x1F3E0; &nbsp;</span> {item.Adresa}</p>
              <p>  <span role="img" aria-label="nn">&#128219; &nbsp;</span>{item.BrLicneKarte}</p>

              <hr />

              <div className="btn-group" role="group" aria-label="Basic example">
                <Link to={`/UserAdd/${item._id}`}><h6>Edit </h6></Link> &nbsp; &nbsp; &nbsp;
                <Link to={`/UserDetails/${item._id}`}><h6>Details </h6></Link>
              </div>
            </div>

          )}


        <div className="custpaging">

          <Pagination activePage={this.props.users.searchParams.pageNumber} itemsCountPerPage={this.state.limit} onChange={this.handlePageChange}
            totalItemsCount={this.props.users.count} pageRangeDisplayed={10} innerClass="btn-group mr-2" itemClass="btn btn-outline-primary btn-sm" itemClassFirst="page-item"
            linkClass="" activeLinkClass="" activeClass="page-item active" disabledClass="text-secondary" firstPageText="first" lastPageText="last" nextPageText=">" prevPageText="<"
          />
        </div> </div>
    );
  }
}
//export default UsersPanel;

// REDUX:
const mapStateToProps = state => ({
  users: state.users,
  errors: state.errors
});
export default connect(mapStateToProps, { getUsers })(UsersPanel);