
import React, { Component } from 'react';
import PorukaItem from './PorukaItem';
import {
  //getPosiljaociPoruka, //getPoruke,
  // PostPoruke,
  // getCountNewMessage,
  // setProcitanoMsg,
  //  delleteMessage
} from '../WebApi';

import { getCountNewMessage, getPoruke, PostPoruke, setProcitanoMsg, delleteMessage, getPosiljaociPoruka } from "../WebApis/requestsGraphQL.js";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'



class Poruke extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: [], poruke: [], rola: "Client", limit: 6, rowPosiljaoci: 0, rowPoruke: 0,
      selectedUser: { Korisnik: "", KorisnikID: "", Slika: "" },
      showMsgBlock: false, countNewMess: "", logedUser: null, hoverItem: -1
    };

    this.loadPosiljaoci = this.loadPosiljaoci.bind(this);
    this.loadPosiljaoci();
    this.selectItem = this.selectItem.bind(this);
    this.loadMorePosiljaoci = this.loadMorePosiljaoci.bind(this);
    this.search = this.search.bind(this);
    this.changeRole = this.changeRole.bind(this);
    this.loadMorePoruke = this.loadMorePoruke.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.hoverMsg = this.hoverMsg.bind(this);
    this.getCountNewMessag = this.getCountNewMessag.bind(this);
    this.delleteMsg = this.delleteMsg.bind(this);

  }
  async componentWillMount() {
    //console.log("load...loged user ID :",this.props.auth.user.id);
    //await this.setState({logedUser: this.props.auth.user.id});
    //console.log("load...loged user state  ID :",this.state.logedUser);
    // this.loadPosiljaoci();
  }

  async getCountNewMessag() {
    let coutNewMess = await getCountNewMessage(this.props.auth.user.id);
    if (coutNewMess.Osoblje === 0) coutNewMess.Osoblje = "";
    if (coutNewMess.Klijent === 0) coutNewMess.Klijent = "";
    await this.setState({ countNewMess: coutNewMess });
    console.log("ID USER:", this.props.auth.user.id);
    console.log("coutNewMess:", this.state.countNewMess);
  }


  async loadPosiljaoci() {
    var list = await getPosiljaociPoruka(this.props.auth.user.id, this.state.rola, this.state.rowPosiljaoci, " ", this.state.limit);
    await this.setState({ showList: list });
    this.getCountNewMessag();
  }
  async search() {  // ova fnk se treba spojiti sa gornjom- kod je isti...
    // this.Message.value="";
    var list = await getPosiljaociPoruka(this.props.auth.user.id, this.state.rola, 0, this.SearchString.value, this.state.limit);
    this.setState({ showList: list, rowPosiljaoci: 0 });
  }
  async selectItem(id) {
    // console.log("id itema je:", id);
    let list = this.state.showList;
    let item = list.find((element) => { return element.SagovornikID === id })
    if (item.Procitano === false) {
      item.Procitano = true;
      /// ako je neprocitana setuj u bazi da je procitana
      setProcitanoMsg(id, this.props.auth.user.id);
      this.getCountNewMessag();
    }
    this.setState({ showList: list, selectedUser: item, rowPoruke: 0 });         // sta ovaj diop radi provjeri???
    var por = await getPoruke(this.props.auth.user.id, id, 0);
    this.setState({ poruke: por.reverse(), showMsgBlock: true });
    this.Message.value = "";
  }
  async loadMorePoruke() {
    console.log("Selektovani user: ", this.state.selectedUser.SagovornikID);
    if (this.state.selectedID === null) return;
    let row = this.state.rowPoruke + 5;
    let por = this.state.poruke;
    let newPor = await getPoruke(this.props.auth.user.id, this.state.selectedUser.SagovornikID, row);
    newPor = newPor.reverse();
    let porMerg = newPor.concat(por);
    this.setState({ poruke: porMerg, rowPoruke: row });
  }

  async loadMorePosiljaoci() {   // ovu funkciju spojiti sa 2 prethodne... nema potrebe imati 3 fnk!
    //let row = this.state.rowPosiljaoci + 2;
    let row = this.state.showList.length;
    console.log("ROW :", row);

    await this.setState({ rowPosiljaoci: row });
    // test merganje 2 liste
    var listPrva = this.state.showList;
    //var listDruga = await getPosiljaociPoruka(this.props.auth.user.id, this.state.rola, this.state.rowPosiljaoci, this.SearchString.value);
    var listDruga = await getPosiljaociPoruka(this.props.auth.user.id, this.state.rola, row, this.SearchString.value, this.state.limit);
    var listMerg = listPrva.concat(listDruga);
    this.setState({ showList: listMerg });
    //console.log("merganje ++:", listMerg);
  }

  async changeRole() {

    let newRpla = "Client";
    if (this.state.rola === "Client") { newRpla = "Osoblje"; }
    await this.setState({ rola: newRpla, rowPosiljaoci: 0, showMsgBlock: false });
    this.search();
  }
  async sendMessage(e) {
    // console.log('e: ',e.target.value)
    // console.log('e.keyCode : ', e.keyCode)
    if (e.keyCode === 13 && this.Message.value.trim() !== "" && this.state.selectedUser.SagovornikID !== "") {
      var newMessage =
      {
        PosiljaocID: this.props.auth.user.id,
        PrimaocID: this.state.selectedUser.SagovornikID,
        Sadrzaj: this.Message.value,
        DatumUnosa: new Date().toString(),  // SVE DATUME PREPRAAVITI JER NE UZIMA ISPRAVNO GETDATE!!!
        Procitano: false,
        Aktivno: true
      }
      await PostPoruke(newMessage); this.Message.value = "";
      this.selectItem(this.state.selectedUser.SagovornikID);
      console.log('DATUM sati:', new Date());
    }
  }
  hoverMsg(index) {
    if (index === this.state.hoverItem) { this.setState({ hoverItem: -1 }); }
    else { this.setState({ hoverItem: index }); }
  }
  delleteMsg(id, index) {
    delleteMessage(id);  // sinhroni poziv...
    let delItem = this.state.poruke[index];
    delItem.Sadrzaj = "*** deleted message ***";    // nije bas najispravnije (treba setstate), ali neka stoji za sad ovako...
    //   this.setState({poruke[index]: delItem});
  }
  render() {
    return (

      <div  >
        <div className="custtitlebox">
          <h4>Messages</h4>
        </div>


        <div className="leftnavipanel">

          <div className="messagesearchelem">
            <ul className="nav nav-tabs">
              <li className="nav-item">  <a className="nav-link active" data-toggle="tab" href="#home" onClick={this.changeRole}>Clients
                                                        &nbsp;   <span className="badge badge-danger">{this.state.countNewMess.Klijent}</span></a>
              </li>
              <li className="nav-item">  <a className="nav-link" data-toggle="tab" href="#home" onClick={this.changeRole}>Employees
                                                        &nbsp;  <span className="badge badge-danger">{this.state.countNewMess.Osoblje}</span></a>
              </li>
            </ul>

          </div>
          <div className="messagesearchelem">
            <input className="form-control form-control-sm" ref={(ref) => this.SearchString = ref} placeholder="Search..." type="text" onChange={this.search} />
          </div>

          <div className="messagesearchelem2">
            <div className="messagesearchlist" ref={(el) => { this.messagesEnd = el; }} >
              <table className="table-hover" style={{  width: "100%"}}>
                <tbody>
                  {this.state.showList.map((item, index) =>
                    <tr  key={index}><th><PorukaItem itemShow={item} selectItem={this.selectItem} /></th></tr>
                  )}
                </tbody>
              </table>

            </div>
            <center><button float="center" type="button" className="btn btn-link" onClick={this.loadMorePosiljaoci} >load more...</button></center>

          </div>
        </div>

        {this.state.showMsgBlock === true ?
          <div className="messageListConteiner">

            <div className="form-inline">
              <img src={this.state.selectedUser.SagovornikAvatar} className="avatarchat" alt="slika" />
              <h6><b>{this.state.selectedUser.Sagovornik} </b></h6>
              <center><button float="right" type="button" className="btn btn-link" onClick={this.loadMorePoruke} >load more...</button></center>
            </div>

            <div className="containermessage" >
              {this.state.poruke.map((item, index) =>
                <div key={item._id} className="messagerow"
                  onMouseEnter={() => { this.hoverMsg(index) }} onMouseLeave={() => { this.hoverMsg(index) }}    >

                  <div className={item.PosiljaocID === this.props.auth.user.id ? "messageitem" : "messageitemkl"} data-toggle="tooltip" data-placement="bottom" title={item.Datum + '  /  ' + item.Vrijeme}>
                    {index === this.state.hoverItem && item.PosiljaocID === this.props.auth.user.id ?
                      <Link style={{ marginRight: "10px" }} className="" onClick={() => { this.delleteMsg(item._id, index) }} >
                        <span className="text-danger">&#10006;</span>
                      </Link>
                      : ""}
                    {item.Sadrzaj}

                  </div>

                  <br />
                </div>
              )}
            </div>


            <textarea className="form-control form-control-sm" rows="3" ref={(ref) => this.Message = ref} onKeyDown={this.sendMessage} placeholder="your message" type="text" />

          </div>
          : ""}
















      </div>

    );
  }
}


//export default Poruke;

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Poruke);