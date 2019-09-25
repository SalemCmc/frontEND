


import React, { Component } from 'react';
import { getPetByOwnerID } from "../WebApis/requestsGraphQL.js";
//import Spinner from '../CommonComponents/Spinner'

class PetsList extends Component {
    constructor(props) {
        super(props);
        this.state = { petRow: 0, pets: [], count: -1 };
        this.loadPets = this.loadPets.bind(this);
        this.loadPets();
    }

    async loadPets(action) {


        let row = this.state.petRow;
        if (action === "NEXT") {
            row = row + 1;
        }
        if (action === "PREV") {
            row = row - 1;
        }
        if (row < 0 || this.state.count === row) { return; }
        var newPets = await getPetByOwnerID(this.props.id, row, 3);
        //console.log("ID PARAM: ", newPets);
        this.setState({ pets: newPets.items, count: newPets.count, petRow: row });
    }


    render() {



        return (

            <div className="petpnl">
                <center>
                    <h5>
                        <button className="custarrow" onClick={() => { this.loadPets("PREV") }}>&#10094;</button>
                        <span className="text-muted ">Pets</span >
                        <button className="custarrow" onClick={() => { this.loadPets("NEXT") }} >&#10095;</button>
                    </h5>  <hr />


                    {this.state.pets.map((item) =>
                        <div key={item._id} className="conteiner33procent" >
                            <img className="petitemimage" src={item.Slika} alt="photoUser" onClick={() => { this.props.onClick("PETEDETAIL", item._id) }} />
                            <h5 className="text-muted">{item.Ime} </h5>
                        </div>
                    )}
                </center>
            </div>




        );
    }
}
export default PetsList;