

import React, { Component } from 'react';
import Search from '../Search';
//import { getKorisnici } from '../WebApi';
import { getKorisnici } from "../WebApis/requestsGraphQL.js";
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import Spinner from '../CommonComponents/Spinner'

class Korisnici extends Component {
  constructor(props) {
    super(props);
    this.state = { KorisniciList: [], Count: 0, rola: "Klijent", row: 0, aktivni: true, limit: 4, searchString: " " };
    this.getKorisnici = this.getKorisnici.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.search = this.search.bind(this);
    this.getKorisnici(" ", "");

  }
  async  search(searchString, searchDate, searchCheck, searchRadio) {
    // funkcija pozvana iz componente search ! salje 4 parametra, pa se uzimaju koji trebaju ovoj komponenti!
    // recimo datum nije potreban u ovom slucaju, ali ga salje search componenta
    await this.setState({ searchString: searchString, row: 0, aktivni: searchCheck, rola: searchRadio });
    this.getKorisnici();
  }
  async getKorisnici() {
    let kor = await getKorisnici(this.state.searchString, this.state.rola, this.state.aktivni, this.state.row, this.state.limit);
    this.setState({ KorisniciList: kor.items, Count: kor.count });
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
          <Search search={this.search} sstring="true" sdate="false" scheck="true" sradio="true" />
          <h4 >Clients and Employees</h4>
          <Link to="/KorisniciAdd/null">Add new user</Link>
        </div>

        {this.state.KorisniciList.length < 1 ?
          <Spinner />
          :
          this.state.KorisniciList.map(item =>

            <div className="custcard" key={item._id}>
              <div className="cardphoto">
                <img src={item.Slika} alt="John" style={{ height: "100%", width: "100%", borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }} />
              </div>
              <h4>{item.Ime + " " + item.Prezime}</h4>
              {item.Aktivan === true ? ""
                : <h6 className="text-danger"><b><span role="img" aria-label=""> &#9940;</span>
                  NEAKTIVAN</b></h6>}
              <hr />
             
                <p>  <span role="img" aria-label="nn">&#x260E; &nbsp;</span> {item.Telefon}</p>
                <p>  <span role="img" aria-label="nn">&#x2709; &nbsp; </span> {item.Email}</p>
                <p>  <span role="img" aria-label="nn">&#x1F3E0; &nbsp;</span> {item.Adresa}</p>
                <p>  <span role="img" aria-label="nn">&#128219; &nbsp;</span>{item.BrLicneKarte}</p>
              
              <hr />


              <div className="btn-group" role="group" aria-label="Basic example">
                <Link to={`/KorisniciAdd/${item._id}`}><h6>Edit </h6></Link> &nbsp; &nbsp; &nbsp;
                <Link to={`/KorisniciDetails/${item._id}`}><h6>Details </h6></Link>
              </div>
            </div>

          )}


        <div className="custpaging">

          <Pagination activePage={this.state.pn} itemsCountPerPage={this.state.limit} onChange={this.handlePageChange}
            totalItemsCount={this.state.Count} pageRangeDisplayed={10} innerClass="btn-group mr-2" itemClass="btn btn-outline-primary btn-sm" itemClassFirst="page-item"
            linkClass="" activeLinkClass="" activeClass="page-item active" disabledClass="text-secondary" firstPageText="prva" lastPageText="zadnja" nextPageText=">" prevPageText="<"
          />
        </div> </div>
    );
  }
}

export default Korisnici;