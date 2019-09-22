
import React, { Component } from 'react';
import { Link } from 'react-router-dom'

// Api's functions:
//import {  deactivatePet } from "../WebApis/requestsGraphQL.js";

// child components:
import Spinner from '../CommonComponents/Spinner'
import Confirm from "../CommonComponents/Confirm"
import Pagination from "react-js-pagination";
import PetAdd from './PetAdd';
import PetDetail from './PetDetail';
import Modal from '../CommonComponents/Modal';

// REDUX:
import { connect } from 'react-redux';
import { getPetsByUserID, deactivatePet } from '../actions/petsActions';

class Pets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      row: 0, limit: 3, showSuccessAlert: false, showErrorAlert: false, alertMessage: "",
      showModal: false, modalTitle: "", modalChild: null, selectedPetID: null
    };

    this.loadPets = this.loadPets.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.removePetModal = this.removePetModal.bind(this);
    this.addNewPetModal = this.addNewPetModal.bind(this);
    this.removePet = this.removePet.bind(this);
    this.detailPetModal = this.detailPetModal.bind(this);

  }

  componentDidMount() {
    if (this.props.pets.searchParams !== {} && this.props.pets.searchParams.userID !== this.props.VlasnikID) {
      this.setState({ row: 0, pn: 1 });
      this.loadPets();
    }
  }

  async handlePageChange(pageNumber) {
    let br = (pageNumber - 1) * this.state.limit;
    await this.setState({ row: br, pn: pageNumber });
    this.loadPets();
  }
  handleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  async loadPets() {
    let searchParams = {};
    searchParams.userID = this.props.VlasnikID;
    searchParams.row = this.state.row;
    searchParams.limit = this.state.limit;
    searchParams.pageNumber = this.state.pn;
    await this.props.getPetsByUserID(searchParams);  // REDUX
  }

  removePetModal(ID) {

    let modChld = <div> <Confirm confirmClick={this.removePet} hide={this.handleModal} message="Are you sure you want delete this pet?" /> </div>;
    this.setState({ showModal: !this.state.showModal, modalChild: modChld, modalTitle: "Confirm Deletion!", selectedPetID: ID });
  }
  async removePet() {
    await this.props.deactivatePet(this.state.selectedPetID);
    this.handleModal();
    this.loadPets();
  }
  addNewPetModal() {
    let modChld = <div> <PetAdd addPacijent={this.addPacijent} VlasnikID={this.props.VlasnikID} refreshParent={this.loadPets} /> </div>;
    this.setState({ showModal: !this.state.showModal, modalChild: modChld, modalTitle: "Add new pet" });
  }
  detailPetModal(idPet) {
    let modChld = <div> <PetDetail petID={idPet} /> </div>;
    this.setState({ showModal: !this.state.showModal, modalChild: modChld, modalTitle: "Pet Detail" });

  }



  render() {
    return (<div>
      {this.props.pets.loading === true ?
        <Spinner />
        :
        <div className="">

          <div className="custtitleboxpets">
            {this.props.pets.count > 0 ? <h4 className="text-muted" >Pets</h4> : <h4 className="text-danger">This user doesn't own any pet!</h4>}
            <Link to="#" onClick={this.addNewPetModal} >Add new pet</Link>
          </div>

          <Modal show={this.state.showModal} handleClose={this.handleModal} title={this.state.modalTitle} >
            {this.state.modalChild}
          </Modal>
          <div className="custcontent" >
          
         
            {this.props.pets.items.map((item, index) =>
             <div className="conteiner33procentpets" key={index}>
             
              <div className="custcard" >
                <div className="cardphoto">
                  <img src={item.Slika} alt="pet" style={{ height: "100%", width: "100%", borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }} />
                </div>
                <h4>{item.Ime}</h4>
                <hr />
              
                <p>
              <span className="text-muted"  >  Race:</span>
              <span className="text-right">  <b>{item.Rasa}</b></span>
               </p>
               <p>
              <span className="text-muted" >   Weight:</span>
              <span className="text-right">  <b>{item.Tezina+' kg.'}</b></span>
               </p>
               <p>
              <span className="text-muted" >  Date of birth:</span>
              <span className="text-right">  <b>{item.DatumRodjenja}</b></span>
               </p>

                <hr />
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button className="btn btn-outline-danger btn-sm" type="submit" onClick={() => { this.removePetModal(item._id) }} >Remove </button>
                  <button className="btn btn-outline-warning btn-sm" type="submit" onClick={() => { this.detailPetModal(item._id) }} >Details </button>
                </div>
              </div> </div>
            )}
         
</div>
          {this.props.pets.count > this.state.limit ?

            <div className="custpaging">
              <Pagination activePage={this.props.pets.searchParams.pageNumber} itemsCountPerPage={3} onChange={this.handlePageChange}
                totalItemsCount={this.props.pets.count} pageRangeDisplayed={10} innerClass="btn-group mr-2" itemClass="btn btn-outline-primary btn-sm" itemClassFirst="page-item"
                linkClass="" activeLinkClass="" activeClass="page-item active" disabledClass="text-secondary" firstPageText="first" lastPageText="last" nextPageText=">" prevPageText="<"
              />
            </div>
            : ""}
   
        </div>
      }</div>
    );
  }
}
//export default Pets;
// REDUX:
const mapStateToProps = state => ({
  pets: state.pets,
  errors: state.errors
});
export default connect(mapStateToProps, { getPetsByUserID, deactivatePet })(Pets);