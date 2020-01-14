import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation.js";
import Logo from "./components/Logo/Logo.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import Rank from "./components/Rank/Rank.js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import SignIn from "./components/SignIn/SignIn.js";
import Register from "./components/Register/Register.js";

import "./App.css";
import Clarifai from "clarifai";
//Importing keys from config file
const secret_key = require("./configurations/config").key;

//The key is intentionally not written here for security purpose
const app = new Clarifai.App({
  apiKey: secret_key
});

const particlesOptions = {
  particles: {
    number: {
      value: 130,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route:'signin',
      isSignedIn: false,
      user: {
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
    };
  }

  loadUser = (data) =>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
    }})
  }

  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height-(clarifaiFace.bottom_row*height)
    }
  };

  displayFaceBox =(box) => {
    console.log(box);
    this.setState({box:box});
  }

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  };

  onRouteChange = (route) => {
    if(route ==='signout') {
      this.setState({isSignedIn:false})
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route})
  }
  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route ==='home'
          ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition 
              box={this.state.box} 
              imageUrl={this.state.imageUrl} 
            />
          </div>
          :(
            this.state.route ==='signin'
            ?<SignIn onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
