
import React, { Component } from 'react';


class PorukaItem extends Component {
  constructor(props) {
    super(props);
    this.state = { class: "", };  // ne trebAAA
    this.clickItem = this.clickItem.bind(this);


  }
  clickItem() {
    // console.log("KLIKNUTI ITEM JE:", this.props.itemShow.KorisnikID );
    this.props.selectItem(this.props.itemShow.SagovornikID);
  }
  getClass() {
    let classs = "";
    if (this.props.itemShow.Procitano === false) {
      classs = "text-white bg-info"
    }
    return classs;
  }


  render() {
    //console.log("ITEm:", this.props.itemShow);
    return (

      <div className={this.getClass()} onClick={this.clickItem}>


        <div className="form-inline">

          <img src={this.props.itemShow.SagovornikAvatar} className="avatarchat" alt="slika" />
          <h6 ><br /><b> {this.props.itemShow.Sagovornik}</b> - <small>  {this.props.itemShow.Datum}</small>
            <br />
            {this.props.itemShow.Message}...
              </h6>

        </div>
      </div>

    );
  }
}

export default PorukaItem;