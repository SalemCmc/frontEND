
import React, { Component } from 'react';


class Messagetem extends Component {
  constructor(props) {
    super(props);
    this.state = { class: "", }; 
    this.clickItem = this.clickItem.bind(this);
  }
  clickItem() {
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
  
    return (
      <div className={this.getClass()} onClick={this.clickItem}    >

           <div className="form-inline"  >
              <div className="right"><img src={this.props.itemShow.SagovornikAvatar} className="avatarchat" alt="slika" /></div>

              <div className="right" >
               
                <b> {this.props.itemShow.Sagovornik}</b> 
                <br/>
                <small> {this.props.itemShow.Message}...</small>  <br/>
                <small>{this.props.itemShow.Datum}</small>
                </div>
</div>


      </div>

    );
  }
}

export default Messagetem;