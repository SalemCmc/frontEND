



import React, { Component } from 'react';
import Spinner from '../CommonComponents/Spinner'
//import { getPriceList } from '../WebApi';   DONT USE!
import { getPriceList } from "../WebApis/requestsGraphQL.js";

class PriceList extends Component {
    constructor(props) {
        super(props);
        this.state = { priceList: [] };

        this.loadPriceList = this.loadPriceList.bind(this);
        this.loadPriceList();
    }
    async loadPriceList() {
        let priceList = await getPriceList();
        this.setState({ priceList });
        // console.log("LSITA CIJENA: ", this.state.priceList);

    }


    render() {
        let showList = null;
        if (this.state.priceList.length < 1) {
            showList = <Spinner />;
        }
        else {
            showList = <div className="leftnavitem">  <h4>Price list</h4>
                <table className="table table-hover">
                    <thead><tr className="table-info"><th>Service</th><th>Price</th></tr></thead>
                    <tbody>
                        {this.state.priceList.map((item, index) =>
                            <tr key={index}><td>{item.Service}</td><td>{item.Price + ' KM'}</td></tr>
                        )}
                    </tbody>
                </table> <br /><br /><br />
                <p><small>Value-added tax is included in price.</small></p>
            </div>;
        }
        return (

            <div className="" >

                {showList}
            </div>

        );
    }
}


export default PriceList;
