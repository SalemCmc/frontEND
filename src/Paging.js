

import React, { Component } from 'react';
import Pagination from "react-js-pagination"; 
//require("bootstrap/less/bootstrap.less");


class Paging extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { activePage: 0, };
        this.handlePageChange=this.handlePageChange.bind(this);
       // this.handlePageChange(1); 
    }
    componentDidUpdate(prevProps)
     {
      // OPIS BITNO:  Ovu funkciju koristimo umjesto  this.handlePageChange(1);  u konstruktoru, jer kad se ucitava komponenta nisu sve vrijednosti popunjene i app se ne ponasa kako zelimo.
      // tacnije nema vrijednosti sa kojima se zeli raditi...
      // kao recimo lista iz props-a, pa se ova funkcija ppozove kad se sve popuni na komponenti i onda se mogu koristiti vrijednosti iz state-a ili props-a.
      // ova funkcija ce se uvijek pozvati ako se promjeni state ili props, tako d amoze doci do beskonacne petlje, zbog toga postoji if petlja da se pozove samo prvi put, tj da inicijalno ucita jedan page za paging... 05.02.2019 JS
     
     if (this.props.pageList !== prevProps.pageList )
       {  // pozove se samo prvi put! 
        this.setState({activePage: 0});  // kad se radi search da se setuje na 0
        this.handlePageChange(1);
       }
    }
     
     handlePageChange(pageNumber)
    {
      //  console.log("index je: ", this.state.activePage);
        this.setState({activePage: pageNumber});
        var from = (pageNumber-1) * this.props.pageRangeDisplayed ;
        var to= from +this.props.pageRangeDisplayed;
        var page = this.props.pageList.filter((i ,index)=>{return index>=from && index<to ;})
         this.props.setPage(page);    
    }
  render() {   
    return (
        <div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={10}
          totalItemsCount={(this.props.pageList.length/this.props.pageRangeDisplayed) *10}
          pageRangeDisplayed={10}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default Paging;