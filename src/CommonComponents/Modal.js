


import React, { Component } from 'react';

//import KorisniciDetails from './KorisniciComp/KorisniciDetails';


class Modal extends Component {

  render() {

    // console.log("this.props.show : ", this.props.show);
    if (!this.props.show) {
      return null;
    }
    return (

      <div className="modal display-block">
        <section>
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <h4>{this.props.title}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true" onClick={this.props.handleClose}>&times;</span></button>
              </div>
              <br />
              <div className="modal-body11">

                {this.props.children}
              </div>

            </div>
          </div>
        </section>
      </div>
    );
  }
}

//Modal.propTypes = {  onClose: PropTypes.func.isRequired,  show: PropTypes.bool,  children: PropTypes.node};

export default Modal;