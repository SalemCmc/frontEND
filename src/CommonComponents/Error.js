




import React from 'react';

function Error(props) {


    return <div className="alert alert-dismissible alert-danger">

        <strong>Oh snap!</strong> Something went wrong.
  <br />
  <hr/>
        <p><small>{props.message}</small></p>
    </div>;
}
export default Error;