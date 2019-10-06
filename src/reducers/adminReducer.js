
import { GET_INITIAL_DATA, GET_PERMISSIONS,SET_NEW_PERMISSION,CLEAN_PERMISSIONS_BY_ROLES, ADMIN_LOADING } from '../actions/types';

const initialState = {
  
  roles: [],            //initial data-
  permisionList: [],   //initial data- list of all permisions from DB-without checked permissions by selected role
  selectedRoleID:null,
  permissionsByRole: [], // list of all permisions by selected roleS
  
  permisionListByRole: [], // list of  permisions by selected role to show in component
  permisionListShow:[],

  permissionsForSave:[],

  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {

    case GET_INITIAL_DATA:
      return {
        ...state,
        roles: action.roles,
        permisionList: action.permisionList,
        loading: false
      };
    case GET_PERMISSIONS:
      return {
        ...state,
        permisionListShow: action.permisionListShow,
        permissionsByRole: action.permissionsByRole,
        selectedRoleID:action.selectedRoleID,
        loading: false
      };
      case SET_NEW_PERMISSION:
        return {
          ...state,
          permisionListShow: action.permisionListShow,
          permissionsForSave:action.permissionsForSave
        };
      case CLEAN_PERMISSIONS_BY_ROLES:
          return {
            ...state,
            permissionsByRole: action.permissionsByRole,

        };
    case ADMIN_LOADING:
      return {
        ...state,
        loading: action.loading
      };
    default:
      return state;
  }
}