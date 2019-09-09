
import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { getAllPermissions } from "../WebApis/requestsGraphQL.js";
//, getPermissionsByRole




///-----------------------------------------IN PROGRESS--------------------------------------------//
///-----------------------------------------IN PROGRESS--------------------------------------------//
///-----------------------------------------IN PROGRESS--------------------------------------------//
///-----------------------------------------IN PROGRESS--------------------------------------------//
///-----------------------------------------IN PROGRESS--------------------------------------------//
///-----------------------------------------IN PROGRESS--------------------------------------------//








///-----------------------------------------IN PROGRESS--------------------------------------------//
///-----------------------------------------IN PROGRESS--------------------------------------------//


class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { permissionsList: [], group: [] };
    this.loadDetails = this.loadDetails.bind(this);
    this.loadDetails();
  }
  async loadDetails() {

   /*  let res = await getAllPermissions();
    console.log("PERMISIJE IZ BAZU: ", res);

    let group = [];
    res.map((item) => {
      group.push(item.Group);
    })

    let Fgroup = Array.from(new Set(group));
    this.setState({ permissionsList: res, group: Fgroup }); */





  }

  render() {
    return (
      <div className="" >


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


            <hr />
            <div className="row">
              <div className="col-6">
                <ul clclassNameass="list-group">
                  {this.state.permissionsList.map((item) =>
                    <div>
                      <button type="button" className="btncollapse" data-toggle="collapse" data-target="#demo">Simple collapsible</button>
                      <div id="demo" className="collapse">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </div>
                    </div>
                  )}
                </ul>
              </div>
              <div className="col-6">
                <ul className="card">
                  <h6>List of permissions</h6>
                  {this.state.group.map((item) =>


                    <li key={item} className="" >
                      <button type="button" class="btn btn-link">
                        <h5 data-toggle="collapse" data-target={'#' + item}>{item} </h5>
                      </button>

                      <div id={item} className="collapse">
                        {this.state.permissionsList.map((subItem) =>
                          item === subItem.Group ?
                            <div key={subItem._id} className="">
                              <br />
                              <button type="button" class="btn btn-danger btn-sm">{subItem.Name}</button>

                            </div>
                            : ""
                        )}<hr />
                      </div>
                    </li>
                  )}
                </ul>
              </div>

            </div>

          </div>
        </div>



      </div>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth
});
//export default Header;
//export default connect(mapStateToProps, { logoutUser })(AdminPanel);
export default connect(mapStateToProps, {})(AdminPanel);