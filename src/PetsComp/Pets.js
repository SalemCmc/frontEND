
import React, { Component } from 'react';
import { Link } from 'react-router-dom'

// Api's functions:
import { getPetByOwnerID, deactivatePet } from "../WebApis/requestsGraphQL.js";

// child components:
import Confirm from "../CommonComponents/Confirm"
import Pagination from "react-js-pagination";
import PetAdd from './PetAdd';
import PetDetail from './PetDetail';
import Modal from '../Modal';
//import avatarDefault from '../CommonComponents/avatarDefault.jpg'
//import UploadPhoto from '../CommonComponents/UploadPhoto';

class Pets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Pets: [], row: 0, limit: 3, showSuccessAlert: false, showErrorAlert: false, alertMessage: "",
      showModal: false, modalTitle: "", modalChild: null, selectedPetID: null
    };

    //  this.setPhotoUrl = this.setPhotoUrl.bind(this);
    this.loadPets = this.loadPets.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.removePetModal = this.removePetModal.bind(this);
    this.addNewPetModal = this.addNewPetModal.bind(this);
    this.removePet = this.removePet.bind(this);
    this.detailPetModal = this.detailPetModal.bind(this);
    this.loadPets();
  }
  async handlePageChange(pageNumber) {
    let br = (pageNumber - 1) * this.state.limit;
    //console.log(br);
    await this.setState({ row: br, pn: pageNumber });
    this.loadPets();
  }
  handleModal = () => {
    this.setState({ showModal: !this.state.showModal });
    // console.log("this.state.showModal: ", this.state.showModal);
  };
  async loadPets() {
    getPetByOwnerID(this.props.VlasnikID, this.state.row, this.state.limit)
      .then(result => {
        this.setState({ Pets: result.items, countPets: result.count });
        console.log("Ucitani pacijenti su: ", this.state);
      })
  }
  removePetModal(ID) {

    let modChld = <div> <Confirm confirmClick={this.removePet} hide={this.handleModal} message="Are you sure you want delete this pet?" /> </div>;
    this.setState({ showModal: !this.state.showModal, modalChild: modChld, modalTitle: "Confirm Deletion!", selectedPetID: ID });
  }
  async removePet() {
    await deactivatePet(this.state.selectedPetID);
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
    return (
      <div className="">

        <div className="custtitleboxpets">
          {this.state.Pets.length > 0 ? <h4 >Pets</h4> : <h4 className="text-danger">This user doesn't own any pet!</h4>}
          <Link to="#" onClick={this.addNewPetModal} >Add pet</Link>
        </div>

        <Modal show={this.state.showModal} handleClose={this.handleModal} title={this.state.modalTitle} >

          {this.state.modalChild}
        </Modal>

        <div className="col-container">
          {this.state.Pets.filter(i => i.Aktivan === true).map((item, index) =>
            <div className="custcard" key={index}>
              <div className="cardphoto">
                <img src={item.Slika} alt="John" style={{ height: "100%", width: "100%", borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }} />
              </div>
              <h4>{item.Ime}</h4>
              <hr />
              <p> Race:  {item.Rasa}</p>
              <p> Weight: {item.Tezina} kg</p>
              <p>Date of birth:  {item.DatumRodjenja}</p>
              <hr />
              <div className="btn-group" role="group" aria-label="Basic example">
                <button className="btn btn-outline-danger btn-sm" type="submit" onClick={() => { this.removePetModal(item._id) }} >Remove </button>
                <button className="btn btn-outline-danger btn-sm" type="submit" onClick={() => { this.detailPetModal(item._id) }} >Details </button>
              </div>
            </div>
          )}
        </div>

        {this.state.countPets > this.state.limit ?

          <div className="custpaging">
            <Pagination activePage={this.state.pn} itemsCountPerPage={3} onChange={this.handlePageChange}
              totalItemsCount={this.state.countPets} pageRangeDisplayed={10} innerClass="btn-group mr-2" itemClass="btn btn-outline-primary btn-sm" itemClassFirst="page-item"
              linkClass="" activeLinkClass="" activeClass="page-item active" disabledClass="text-secondary" firstPageText="first" lastPageText="last" nextPageText=">" prevPageText="<"
            />
          </div>
          : ""}
      </div>
    );
  }
}

export default Pets;