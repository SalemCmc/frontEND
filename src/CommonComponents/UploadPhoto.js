

import React, { Component } from 'react';
import avatarDefault from './avatarDefault.jpg';
import Resizer from 'react-image-file-resizer';


//import resizebase64  from 'resize-base64';

// Desc: komponenta radi upload slike i vraca resize base64 string parentu.
// komponenta prima funkciju setBase64 iz parenta.

class UploadPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = { photoUrl: null, avatar: null};
    this.fileChangedHandler = this.fileChangedHandler.bind(this);  
    this.resizeImage = this.resizeImage.bind(this);
  }

   componentDidUpdate(prevProps, prevState)
  {
 //  VAZNO:  prvo se setuje u state avatar, pa se okine ova funkcija i ne desi se nista(zbog petlje ispod)
 //         kad se setuje slika okine se opet ova funkcija i izvrsi se kod ispod(posalje parentu slika i avatar)
    
if(prevState.photoUrl !== this.state.photoUrl)
{
  this.props.setPhotoUrl(this.state.photoUrl, this.state.avatar);
}
  }


     fileChangedHandler(event)
     {
      this.resizeImage(event.target.files[0], 90, "avatar");   // obavezno prvo ide avatar zbog if petlje u prethodnoj funkciji koja se okida na set state...
      this.resizeImage(event.target.files[0], 350, "photoUrl");
     }
     resizeImage(source, size, stateName)
    {
     if(source)
     {
       Resizer.imageFileResizer(source, size,size,'JPEG',50,0, async uri => {this.setState({[stateName]:uri}) },'base64' );   
     }  
    }
  
  
    render() {  //console.log("state slika: ", this.state.photoUrl);  console.log("props slika: ", this.props.srcPhoto);
    let srcPhoto  =  avatarDefault;

    if(this.state.photoUrl === null && this.props.srcPhoto!==null )
    {
      srcPhoto = this.props.srcPhoto;
    }
    if(this.state.photoUrl !== null )
    {
      srcPhoto = this.state.photoUrl;
    }
    
    return (
      <div >
       
          <img className="photoConteiner" src={srcPhoto} alt="vasa slika" />
       
        <div className="form-group">
          <div className="input-group mb-3" type="file" onChange={this.fileChangedHandler} >
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="inputGroupFile02" />
              <label className="custom-file-label" >Choose photo</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadPhoto;

