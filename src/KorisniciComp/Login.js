
import React, { Component } from 'react';
//import { Lograj} from '../WebApi';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';

import Spinner from '../CommonComponents/Spinner'


class Login extends Component
 {
    constructor(props) 
    {
        super(props);    
        this.state = { username:"", pass:"",showLoad: false };
        this.Lograj=this.Lograj.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps (nextProps)  
    {    //this.setState({showLoad: false});
      console.log("NA LOGIN nextProps:", nextProps);
     //console.log("NA LOGIN user je:", this.props.auth);
      
     if(nextProps.auth.isAuthenticated===true)
          {
            if(nextProps.auth.user.rola==="Doktor")  // treba i za admina uraditi!
            {this.props.history.push('/Termini');
          }
          else {this.props.history.push('/Obavjesti');}
           
          }
    }



 async Lograj(e)
{
  e.preventDefault();
let user={
      Username: this.state.username,
      Password: this.state.pass
}
  await this.props.loginUser(user);  //console.log("NA LOGIN user je CLICK:", this.props.auth);
  this.setState({showLoad: true});
}
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
   let loading=null;
   if(this.state.showLoad===true)
   {
     loading= <div>
       <Spinner /><p className="text-success">Prijava na sistem može trajati od 5-10 sekundi...</p>
     </div>  ;   
   }

    return (
        <div className="container" >
          <center>
           <br /> <h4>Prijava na sistem</h4><br /> <br/>        
          <div className="col-sm-5">                     
                <input className="form-control form-control-sm" name="username" value={this.state.username} onChange={this.onChange} placeholder="Username" type="text" />   
                <br/>        
                <input className="form-control form-control-sm" name="pass"     value={this.state.pass}    onChange={this.onChange} placeholder="Lozinka" type="password" />  
                <br/>
           <button type="submit" className="btn btn-primary btn btn-block" onClick={this.Lograj} >Login</button> 
          </div>
          {loading}
          </center>
          <br/><br/><br/>
        </div>
    );
  }
}

// export default Login;

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { loginUser })(Login);