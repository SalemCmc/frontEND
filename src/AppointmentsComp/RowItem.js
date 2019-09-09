




import React, { Component } from 'react';

import RowCell from './RowCell';


class RowItem extends Component {



  render() {  // console.log("ITEM JE:",this.props.item);
    return (

      <tr className="">
        <td className="">  <center>{this.props.sat} </center></td>
        <RowCell terminID={this.props.item[0]._id} VlasnikID={this.props.item[0].VlasnikID} Klijent={this.props.item[0].Vlasnik} status={this.props.item[0].Obavljen} onClickAction={this.props.onClickAction} />
        <RowCell terminID={this.props.item[1]._id} VlasnikID={this.props.item[1].VlasnikID} Klijent={this.props.item[1].Vlasnik} status={this.props.item[1].Obavljen} onClickAction={this.props.onClickAction} />
        <RowCell terminID={this.props.item[2]._id} VlasnikID={this.props.item[2].VlasnikID} Klijent={this.props.item[2].Vlasnik} status={this.props.item[2].Obavljen} onClickAction={this.props.onClickAction} />
        <RowCell terminID={this.props.item[3]._id} VlasnikID={this.props.item[3].VlasnikID} Klijent={this.props.item[3].Vlasnik} status={this.props.item[3].Obavljen} onClickAction={this.props.onClickAction} />
        <RowCell terminID={this.props.item[4]._id} VlasnikID={this.props.item[4].VlasnikID} Klijent={this.props.item[4].Vlasnik} status={this.props.item[4].Obavljen} onClickAction={this.props.onClickAction} />
      </tr>

    );
  }
}
export default RowItem;
