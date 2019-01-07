/* global google */

import React, { Component } from 'react';
import './App.css';
import AppHeader from './AppHeader';
import FilterComponent from './FilterComponent';
import localDbase, { getPlaces } from './localDbase.js';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flags:    0,
      map:      null,
      places:   [],
      markers:  [],
      query:    null
    };

    this.iconHandler = this.burgerIconHandler.bind(this);
    this.flagMod = this.flagModifier.bind(this);
    window.initMap = this.initMap.bind(this);
    this.animationStop = this.filtAnimateStop.bind(this);
    

    this.googlePromise = null;
    this.gcoder = null;
    this.timer = null;
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
    this.gcoder = new google.maps.Geocoder();
 
    let innerInitMap = (results)=>{
      let marks = results.map(
        item=>new google.maps.Marker({position: item.location, map: mapObj, animation: google.maps.Animation.DROP, title: item.name, visible: true})
      );
      this.setState({map: mapObj, markers: marks});
    };

    //this.setState({map: mapObj});
    let placesLatLngPromises = this.state.places.map(item=>this.getCoord(google, item));
    Promise.all(placesLatLngPromises).then(
      results=>innerInitMap(results)
    ).catch(e=>console.log(e));
  }

  
  //  lifted from Stackoverflow.com:
  //
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
        
        const API = localDbase.myAPI;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=googleLoaded`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    return (this.googlePromise);
  }

  componentWillMount() {
    //  load all places from the database into our local "places" list that is
    //  filterable; if this were a real app, the database would be on the server
    this.setState({places: getPlaces("all")});
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

  //  given a place from the database, returns a promise which resolves to an object
  //  containing that place's name and LatLng coordinates; since places in the database
  //  use street addresses, calling this function is necessary to place markers on the map
  getCoord(google, place)
  {
    return(
      new Promise(
        (resolve, reject)=>{
          this.gcoder.geocode({address: place.address}, (results, status)=>{
            if (status === google.maps.GeocoderStatus.OK) {
              resolve({location: results[0].geometry.location, name: place.name});
            } else {
              reject(status);
            }
          });
        }
      )
    );
  }

  filterInputHandler(event) {
    event.preventDefault();
  
    //  if the input has changed within X seconds of the last input, clear the timeout and set it again
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    //  update the text box
    this.setState({query: event.target.value});
    //  use a timer to prevent immediate server queries; only query 1/2 second after any input change
    this.timer = window.setTimeout(
      ()=>{
            let newPlaces = getPlaces(this.state.query);
            
            if (newPlaces.length) {
              this.setState(prevState=>{
                prevState.markers.forEach(
                  mark=>{
                    if (newPlaces.filter(item=>item.name === mark.getTitle()).length === 0) {
                      mark.setVisible(false);
                    }
                  }  
                );
              });
              tempMarkers = this.state.markers;
              tempMarkers.forEach(value=>{
                let matchedPlaces = newPlaces.filter(item=>item.name === value.getTitle());
                if (matchedPlaces.length === 0) {
                  value.setVisible(false);
                }
              });
              

              });
            } else {
              this.setState({places: [], markers: []});
            }
        //  search at the server and display the results here by updating the entire library
          //  of this component with the search results
          BooksAPI.search(this.state.query).then(
            res=>{
              if (res && res.length) {
                //  don't allow displaying books without thumbnails
                res = res.filter(item=>item.imageLinks);
                //  there's no shelf information for any books returned from the search query, so assign it
                //  such that books in the BooksApp library show their correct shelves, and all other books
                //  are assigned to shelf 'none'
                res = res.map(
                  item=>{
                    item.shelf = this.props.bookToShelfFunc(item.id);
                    return (item);
                  }
                );
                this.setState({library: res});
              } else {
                this.setState({library: []});
              }
            }
          ).catch(e=>console.log(e));
      },
      250
    );
  
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
        <div id="map" role="application"></div>
        <FilterComponent flags={this.state.flags} places={this.state.places} animationStop={this.animationStop}/>
      </div>
    );
  }
}

export default App;
