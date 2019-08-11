

import React, { Component } from "react";


class Confirm extends Component {




  render() {
    //const { Obavjesti } = this.state; <h4 className="card-title">Upozorenje!</h4>
    let hrefLink = '#';
    return (
      <div >




        <p className="card-text">{this.props.message}</p>
        <hr />
        <a
          href={hrefLink} className="card-link"
          onClick={this.props.confirmClick}                >
          YES
            </a>
        <a
          href={hrefLink}
          className="card-link"
          onClick={this.props.hide}                >
          NO
            </a>

      </div>
    );
  }
}

export default Confirm;
