

import React from 'react';
import spinner from './spinner.gif';


export default (props) => {
    
    let size="100px";
    if(props.size!==undefined)
    {
       size=props.size;
    }
    
    return (
        <div> 
            <img
                src={spinner}
                style={{ width: size, margin: 'auto', display: 'block' }}
                alt="Loading..."
            />
        </div>
    );
};
