
import React, { Component } from 'react';

import { getAllPermissions, getCommonApi, getPermissionsByRole } from "../WebApis/requestsGraphQL.js";


// REDUX
import { connect } from 'react-redux';
import { getInitialData, selectRole, selectPermision,saveNewPermisionsByRole } from '../actions/adminActions';



///-----------------------------------------IN PROGRESS--------------------------------------------//
///-----------------------------------------IN PROGRESS--------------------------------------------//


class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { listForDelete: [], listForAdd: [], permissions: [] };
    this.loadInitialData = this.loadInitialData.bind(this);

    this.handleCheckPermision = this.handleCheckPermision.bind(this);
 
    this.selectRole = this.selectRole.bind(this);
    this.loadInitialData();

  }
  async loadInitialData() {
    this.props.getInitialData();


    let rol = await getCommonApi("Korisnici");
    let permissions = await getAllPermissions();

    this.setState({ permissionsList: permissions, permissions: permissions, role: rol });
  }
  selectRole() {

    let roleID = this.role.value;
    // this.loadDetails(roleID);
    this.props.selectRole(roleID);
  }





  handleCheckPermision(row, cell) {




    /*     let listPerm = this.state.permissionsList;
    
        let checked = true;
        if (listPerm[row].items[cell].checked !== undefined) {
          checked = !listPerm[row].items[cell].checked;
        }
        listPerm[row].items[cell].checked = checked;
        //console.log("listPerm: ", listPerm);
    
    
        let listForDelete = new Set(this.state.listForDelete);
        let listForAdd = new Set(this.state.listForAdd);
    
        if (checked === false) // delete el
        {
          listForDelete.add(listPerm[row].items[cell]._id);
          listForAdd.delete(listPerm[row].items[cell]._id);
        }
        else {
          listForDelete.delete(listPerm[row].items[cell]._id);
          listForAdd.add(listPerm[row].items[cell]._id);
        }
    
        this.setState({ listForDelete: listForDelete, listForAdd: listForAdd }); */

  }




  render() {
 //   console.log("RENDER:------------------------------------------------",this.props.permisionListShow);
    return (
      <div className="" >
        <div className="custtitlebox"> <h4 className="text-muted">User details</h4></div>

        <div className="leftnavipanel">
          <div className="leftnavitem">

            <button type="button" className="btn btn-outline-secondary btn-block" > Role permissions</button>
            <button type="button" className="btn btn-outline-secondary btn-block">Contacts</button>
            <button type="button" className="btn btn-outline-secondary btn-block">Other information</button>

          </div>
        </div>

        <div className="rightpanel">
          <div className="leftnavitem">

            <h4>Permissions by role</h4>
            <hr />   Role
        <select className="form-control form-control-sm" ref={(ref) => this.role = ref} onChange={this.selectRole}   >
        <option value="">Choose role(type of user)</option>
              {this.props.roles.map(opt => { return (<option key={opt._id} value={opt._id}>{opt.Value}</option>); })}
            </select>

            <hr />
            List of permissions

                <ul className="card">
              {this.props.permisionListShow.map((item, index) =>
                <li key={index} className=" " >
                  <button type="button" className="btn btn-link">
                    <h5 data-toggle="collapse" data-target={'#' + item.Group}>{item.Group} </h5>
                  </button>
                  <div id={item.Group} className="collapse">


                    {item.items.map((subItem, index2) =>
                      <div key={index2} className="">

                        <input type="checkbox" checked={subItem.checked} onChange={() => this.props.selectPermision(index, index2, subItem._id)} /> <b>{" " + subItem.Name + " "}</b>
                        <label className="text-secondary">{" - Desription: " + subItem.Desc}</label>
                      </div>
                    )
                    }

                    <hr />
                  </div>
                </li>
              )}
            </ul>
            <button type="submit" className="btn btn-primary btn btn-sm btn-block" onClick={this.props.saveNewPermisionsByRole} >Save</button>

          </div>
        </div>



      </div>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth,
  roles: state.admin.roles,
  permisionListShow: state.admin.permisionListShow
});
//export default Header;
//export default connect(mapStateToProps, { logoutUser })(AdminPanel);
export default connect(mapStateToProps, { getInitialData, selectRole, selectPermision,saveNewPermisionsByRole })(AdminPanel);