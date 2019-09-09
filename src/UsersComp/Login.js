
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';
//import Error from '../CommonComponents/Error'
import Spinner from '../CommonComponents/Spinner'


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", pass: "" };
    this.Lograj = this.Lograj.bind(this);

  }

  componentWillReceiveProps(nextProps) {



    if (nextProps.auth.isAuthenticated === true) {
      if (nextProps.auth.user.rola === "Doctor")  // treba i za admina uraditi!
      {
        this.props.history.push('/Appointments');
      }
      else { this.props.history.push('/Notifications'); }

    }
  }



  async Lograj() {


    this.username.className = this.pass.className = "form-control form-control-sm";
    if (this.username.value === "" || this.pass.value === "") {


      this.username.className = this.pass.className = "form-control form-control-sm is-invalid";
      return;
    }


    let user = {
      Username: this.username.value,
      Password: this.pass.value
    }
    await this.props.loginUser(user);

  }


  render() {
    let loading = null;
    if (this.props.auth.loading === true) {
      loading = <div>
        <Spinner /><p className="text-success">Prijava na sistem može trajati od 5-10 sekundi...</p>
      </div>;
    }

    return (
      <div className="container" >
        <center>
          {this.props.errors.error === true ?

            <div className="alert alert-dismissible alert-danger">
              <strong>Username or password is incorect!</strong>
            </div>
            : null}

           <h4>Log in</h4>
          <div className="alert alert-dismissible alert-warning">
          If you want to log in in this app, please use one of below accounts
          <hr />
             <div className="left"><strong>Role DOCTOR:</strong>
              <br />username: Doktor
              <br />password: Doktor
              </div> 
              <div>
                    <strong>Role CLIENT:</strong>
              <br />username: sara
              <br />password: sara
              </div>
              <hr />
          
           
              <strong>IMPORTANT:  First logIn can take 10 to 15 seconds (Heroku web server need time to wake up!)</strong>
            </div>


          <div className="col-sm-5">
            <input className="form-control form-control-sm" ref={(ref) => this.username = ref} name="username" placeholder="Username" type="text" />
            <br />
            <input className="form-control form-control-sm" ref={(ref) => this.pass = ref} name="pass" placeholder="Password" type="password" />
            <br />
            <button type="submit" className="btn btn-primary btn btn-block" onClick={this.Lograj} >Login</button>
          </div>
          {loading}
        </center>
        <br /><br /><br />
      </div>
    );
  }
}

// export default Login;

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);