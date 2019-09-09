
import React, { Component } from 'react';
import Messagetem from './Messagetem';

import { getPoruke, PostPoruke, delleteMessage } from "../WebApis/requestsGraphQL.js";

import { Link } from 'react-router-dom'
// REDUX:
import { connect } from 'react-redux';
import { getMessageSenders, setSeen } from '../actions/messagesActions';



class MessagesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poruke: [], rola: "Client", limit: 6, rowPosiljaoci: 0, rowPoruke: 0,
      selectedUser: { Korisnik: "", KorisnikID: "", Slika: "" },
      showMsgBlock: false, hoverItem: -1, searchString: ""
    };

    this.selectItem = this.selectItem.bind(this);
    this.changeRole = this.changeRole.bind(this);
    this.loadMorePoruke = this.loadMorePoruke.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.hoverMsg = this.hoverMsg.bind(this);
    this.delleteMsg = this.delleteMsg.bind(this);
    this.loadMorePosiljaoci = this.loadMorePosiljaoci.bind(this);
  }

  componentDidMount() {
    if (this.props.messages.clients.length < 1) {
      this.getSenders();
    }

  }

  async getSenders(row = 0) {

    let searchParams = {};
    searchParams.userID = this.props.auth.user.id;
    searchParams.role = this.state.rola;
    searchParams.limit = this.state.limit;
    searchParams.row = row;

    searchParams.searchString = this.SearchString.value;
    this.SearchString.value = "";

    await this.props.getMessageSenders(searchParams);  // REDUX
  }
  async selectItem(id) {

    let list = [];
    if (this.state.rola === "Client") {
      list = this.props.messages.clients;
    }
    else {
      list = this.props.messages.employees;
    }
    let item = list.find((element) => { return element.SagovornikID === id })
    if (item.Procitano === false) {
      item.Procitano = true;
      this.props.setSeen(id, this.props.auth.user.id)
    }
    this.setState({ selectedUser: item, rowPoruke: 0 });         // sta ovaj diop radi provjeri???
    var por = await getPoruke(this.props.auth.user.id, id, 0);
    this.setState({ poruke: por.reverse(), showMsgBlock: true });
    this.Message.value = "";
  }


  async loadMorePoruke() {

    if (this.state.selectedID === null) return;
    let row = this.state.rowPoruke + 5;
    let por = this.state.poruke;
    let newPor = await getPoruke(this.props.auth.user.id, this.state.selectedUser.SagovornikID, row);
    newPor = newPor.reverse();
    let porMerg = newPor.concat(por);
    this.setState({ poruke: porMerg, rowPoruke: row });
  }

  async loadMorePosiljaoci() {

    let row = 0;
    if (this.state.rola === "Client") {
      row = this.props.messages.clients.length;
    }
    else {
      row = this.props.messages.employees.length;
    }
    this.getSenders(row);
  }

  async changeRole() {

    let newRpla = "Client";
    if (this.state.rola === "Client") { newRpla = "Employee"; }
    await this.setState({ rola: newRpla, showMsgBlock: false });

    if (this.props.messages.employees.length < 1 && this.state.rola === "Employee") {
      this.loadMorePosiljaoci();
    }
    if (this.props.messages.clients.length < 1 && this.state.rola === "Client") {
      this.loadMorePosiljaoci();
    }

  }
  async sendMessage(e) {

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
      await PostPoruke(newMessage);
      this.Message.value = "";
      this.selectItem(this.state.selectedUser.SagovornikID);

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
                                                        &nbsp;   <span className="badge badge-danger">{this.props.messages.countNewMessages.Klijent}</span></a>
              </li>
              <li className="nav-item">  <a className="nav-link" data-toggle="tab" href="#home" onClick={this.changeRole}>Employees
                                                        &nbsp;  <span className="badge badge-danger">{this.props.messages.countNewMessages.Osoblje}</span></a>
              </li>
            </ul>

          </div>
          <div className="messagesearchelem">
            <input className="form-control form-control-sm" ref={(ref) => this.SearchString = ref} placeholder="Search..."
              type="text" onChange={() => { this.getSenders() }} value={this.props.messages.searchParams.searchString[this.state.rola]} />
          </div>

          <div className="messagesearchelem2">
            <div className="messagesearchlist" ref={(el) => { this.messagesEnd = el; }} >
              <table className="table-hover" style={{ width: "100%" }}>
                <tbody>
                  {this.state.rola === "Client" ?
                    this.props.messages.clients.map((item, index) =>
                      <tr key={index}><th><Messagetem itemShow={item} selectItem={this.selectItem} /></th></tr>
                    )
                    :
                    this.props.messages.employees.map((item, index) =>
                      <tr key={index}><th><Messagetem itemShow={item} selectItem={this.selectItem} /></th></tr>
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
                      <Link to="#" style={{ marginRight: "10px" }} className="" onClick={() => { this.delleteMsg(item._id, index) }} >
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

//export default MessagesPanel;

const mapStateToProps = state => ({
  auth: state.auth,
  messages: state.messages
});

export default connect(mapStateToProps, { getMessageSenders, setSeen })(MessagesPanel);

