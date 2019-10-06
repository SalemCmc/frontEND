


import store from '../store';
import { GET_INITIAL_DATA, GET_PERMISSIONS,SET_NEW_PERMISSION,CLEAN_PERMISSIONS_BY_ROLES, ADMIN_LOADING } from './types';

import { getCommonApi, getAllPermissions, getPermissionsByRole, updatePermissionsByRoles } from "../WebApis/requestsGraphQL.js";

export const getInitialData = () => async dispatch => {

  // set LOADING AND CLEAN ERRORS

  let roles = await getCommonApi("Korisnici")
    .then(response => {
      return response;
    })

  let permList = await getAllPermissions()
    .then(response => {
      return response;
    }
    )
  dispatch({
    type: GET_INITIAL_DATA,
    roles: roles,
    permisionList: permList
  })
};

export const selectRole = (roleID) => async dispatch => {

  let permissionsByRole = store.getState().admin.permissionsByRole;   // SLICE ovdje ne radi, provjeri zasto!!!

  if (permissionsByRole[roleID.toString()] === undefined || permissionsByRole[roleID].length < 1) {
    // get data from DB for this role and fill store!
    permissionsByRole[roleID.toString()] = await getPermissionsByRole(roleID)
      .then(response => { console.log("PERM IZ BAZE: ",response); return response; });
  }
  
  // 2. set permissions of role to list of all permissions
  let permisionList = store.getState().admin.permisionList.slice();   // SLICE CREATE NEW ARRAY AND RETURN
  let permissionsForSave= new Object( store.getState().admin.permissionsForSave[roleID]);

    if(permissionsForSave.listForAdd===undefined || permissionsForSave.listForDelete=== undefined)
    {
      permissionsForSave.listForAdd=[];
      permissionsForSave.listForDelete=[];
    }
console.log("permissionsForSave:",store.getState().admin.permissionsForSave);
  permisionList.map((item) => {  // create list for show (checked/unchecked permisions in list)
                              item.items.map((subItem) => {
                                                          subItem.checked = false;
                                                          if ((permissionsByRole[roleID].includes(subItem._id) || permissionsForSave.listForAdd.includes(subItem._id)) && !permissionsForSave.listForDelete.includes(subItem._id)  ) {
                                                            subItem.checked = true;
                                                          } return "";
                              })
                              return "";
                              })

            dispatch({
              type: GET_PERMISSIONS,
              permisionListShow: permisionList ,
              permissionsByRole: permissionsByRole,
              selectedRoleID:roleID
            })
};

export const selectPermision = (row, cell, id) => async dispatch => { 

  let permisionListShow = store.getState().admin.permisionListShow.slice();
  let permissionsByRole = store.getState().admin.permissionsByRole;
  //let permisionList = store.getState().admin.permisionList.slice(); 
  let selectedRoleID= store.getState().admin.selectedRoleID;
 
  let checked = true;
  if (permisionListShow[row].items[cell].checked !== undefined) {
    checked = !permisionListShow[row].items[cell].checked;
  }
  permisionListShow[row].items[cell].checked = checked;


     let permissionsForSave=store.getState().admin.permissionsForSave;
    
     let listForDelete = [];
     if(permissionsForSave[selectedRoleID] !== undefined && permissionsForSave[selectedRoleID].listForDelete !== undefined )
     {
      listForDelete = permissionsForSave[selectedRoleID].listForDelete;
     }
    let listForAdd = []; 
    if(permissionsForSave[selectedRoleID] !== undefined && permissionsForSave[selectedRoleID].listForAdd !== undefined)
    {
      listForAdd = permissionsForSave[selectedRoleID].listForAdd;
    }
    
    if (checked === false) // delete el
    { if( permissionsByRole[selectedRoleID.toString()].includes(id))
      {
         listForDelete.push(id);
      }
      if(listForAdd.indexOf(id)!==-1)
       {listForAdd.splice( listForAdd.indexOf(id), 1 );} 
    }
    else {
      if(!permissionsByRole[selectedRoleID.toString()].includes(id))
      {
        listForAdd.push(id);
      }
      
      if(listForDelete.indexOf(id)!==-1)
      listForDelete.splice( listForDelete.indexOf(id), 1 );
    } 

    permissionsForSave[selectedRoleID]={listForAdd,listForDelete};


  dispatch({
    type: SET_NEW_PERMISSION,
    permisionListShow: permisionListShow,
    permissionsForSave: permissionsForSave   //podesi i ovo
  })




};
export const saveNewPermisionsByRole = () => async dispatch => {

console.log("SAVE");

let permissionsForSave=  store.getState().admin.permissionsForSave;
let roles=store.getState().admin.roles;
let listForSave=[];

roles.map((item)=>
{
  console.log("roles item:: ", item._id);
if( permissionsForSave[item._id.toString()] !==undefined)
{
  let itemFormat={};
  itemFormat.itemsForAdd=permissionsForSave[item._id.toString()].listForAdd;
  itemFormat.itemsForDelete=permissionsForSave[item._id.toString()].listForDelete;
  itemFormat.RoleID=item._id;
  listForSave.push(itemFormat);
}

})

console.log("LIST ZA SPASI: ",listForSave.length);

updatePermissionsByRoles(listForSave);

return;
let selectedRoleID= store.getState().admin.selectedRoleID;

dispatch({
  type: CLEAN_PERMISSIONS_BY_ROLES,
  permissionsByRole: [],
})
// RELOAD
dispatch(selectRole(selectedRoleID));

};