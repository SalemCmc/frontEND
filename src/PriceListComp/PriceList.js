



import React, { Component } from 'react';
import Spinner from '../CommonComponents/Spinner'
//import { getPriceList } from '../WebApi';   DONT USE!
//import { getPriceList } from "../WebApis/requestsGraphQL.js";  moved to redux
// REDUX:
import { connect } from 'react-redux';
import { getPriceListA } from '../actions/priceListActions';

class PriceList extends Component {

    componentDidMount() {
        // IF store in REDUX is empty call function getPriceList... 
        if (this.props.price.priceList.length < 1) {
            this.props.getPriceListA();
        }
    }

    render() {
        let showList = null;
        if (this.props.price.priceList.length < 1) {
            showList = <Spinner />;
        }
        else {

            showList =
                   <div className="custcontent">
                    <div className="custbodyconttent">
                        <table className="table table-hover">
                            <thead><tr className="table-secondary"><th>Service</th><th>Price</th></tr></thead>
                           
                            <tbody>
                                {this.props.price.priceList.map((item, index) =>
                                    <tr key={index}><td>{item.Service}</td><td>{item.Price + ' KM'}</td></tr>
                                )}
                            </tbody>
                        </table> <br /><br />
                         <p><small>&nbsp;&nbsp;Value-added tax is included in price.</small></p>
                   </div> </div>;
        }
        return (
            <div ><div className="custtitlebox"> <h4 className="text-muted">Price list</h4></div>


                {showList}
                </div>
        );
    }
}
//export default PriceList;

// REDUX:
const mapStateToProps = state => ({
    price: state.price
});
export default connect(mapStateToProps, { getPriceListA })(PriceList);