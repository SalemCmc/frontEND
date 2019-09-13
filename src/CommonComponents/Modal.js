


import React, { Component } from 'react';


class Modal extends Component {

  render() {

    if (!this.props.show) { return null; }

    return (
      <div className="modal display-block">
        <section>
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <h4 className="text-muted">{this.props.title}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}> <span aria-hidden="true" >&times;</span></button>
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