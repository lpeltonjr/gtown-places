/* global google */

import React, { Component } from 'react';
import './App.css';
import AppHeader from './AppHeader';
import FilterComponent from './FilterComponent';
import localDbase from './localDbase.js';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flags: 0,
      map:  null,
      
    };

    this.iconHandler = this.burgerIconHandler.bind(this);
    this.flagMod = this.flagModifier.bind(this);
    window.initMap = this.initMap.bind(this);
    this.animationStop = this.filtAnimateStop.bind(this);
    

    this.googlePromise = null;
  }

  //  mask: identifies bits of this.state.flags to change;
  //  action: 'S': set; 'C': clear; 'T': toggle
  flagModifier(mask, action) {
    
    switch (action) {
      case 'S':
        this.setState(state=>({flags: state.flags | mask}));
        break;
      case 'C':
        this.setState(state=>({flags: state.flags & ~mask}));
        break;
      case 'T':
        this.setState(state=>({flags: state.flags ^ mask}));
        break;
      default:
        break;
    }
  }

  //  event handler for a click of the hamburger icon
  burgerIconHandler() {
    //  flag to set an open or close animation on the filter menu
    this.flagModifier(1, 'S');
    //  toggle the required state of the filter menu -- visible or invisible
    this.flagModifier(2, 'T');
  }

  initMap(google) {
  
    const mapLocation = localDbase.location;
    const mapObj = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: mapLocation});
    this.setState({map: mapObj});
  }

  loadGoogleAPI() {
    console.log("in loadGoogleAPI");
    if (!(this.googlePromise))
    {
      this.googlePromise = new Promise((resolve)=>{
        window.googleLoaded = ()=>{
          console.log("in googleLoaded");
          resolve(google);
        };
        //const googScriptStr = '<script async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAnnR8DMA8u33ifzz7C2zJpyGFX8D5D8MM&v=3&callback=googleLoaded">';      
        //document.getElementById('root').insertAdjacentHTML('afterend', '<script async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAnnR8DMA8u33ifzz7C2zJpyGFX8D5D8MM&v=3&callback=googleLoaded"></script>');
        const script = document.createElement("script");
        const API = 'AIzaSyAnnR8DMA8u33ifzz7C2zJpyGFX8D5D8MM';
        //const API = 'WHATEVER';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=googleLoaded`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    return (this.googlePromise);
  }

  componentWillMount() {
    this.loadGoogleAPI();
  }

  componentDidMount() {

    if (!(this.state.map))
    {
      this.loadGoogleAPI().then((google)=>{
        window.initMap(google);
      });
    }
  }

  filtAnimateStop() {
    if (this.state.flags & 1) {
      this.flagModifier(1, 'C');
    }
  }
  
  render() {
    return (
      <div className="page-container">
        <AppHeader iconHandler={this.iconHandler} headerText={localDbase.titleText} />        
        <div id="map"></div>
        <FilterComponent flags={this.state.flags} animationStop={this.animationStop}/>
      </div>
    );
  }
}

export default App;
