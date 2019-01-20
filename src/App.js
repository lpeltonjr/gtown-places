/* global google */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import AppHeader from './AppHeader';
import FilterComponent from './FilterComponent';
import InfoWinComponent from './InfoWinComponent';
import localDbase, { getPlaces } from './localDbase.js';
import yelpHelper from './yelpHelper.js';


class App extends Component {
  constructor(props) {
    super(props);

    //  the map object, marker objects, displayed place list, and query string
    //  will all be stored as application state; flags will be used to mark the
    //  required state of the (mobile) sliding filter/list component and to
    //  force re-rendering when it changes
    this.state = {
      flags:    0,
      map:      null,
      places:   [],
      markers:  [],
      query:    ""
    };

    //  bindings to "this" for global access to App class methods
    this.iconHandler = this.burgerIconHandler.bind(this);
    this.flagMod = this.flagModifier.bind(this);
    window.initMap = this.initMap.bind(this);
    this.animationStop = this.filtAnimateStop.bind(this);
    this.queryHandler = this.filterInputHandler.bind(this);
    this.listSelect = this.filterListSelectEvent.bind(this);

    //  class instance variables available to all methods
    //  googlePromise resolves to the Google API object
    this.googlePromise = null;
    //  gcoder is the Google Geocoder object for obtaining latLng
    //  coordinates from our database addresses
    this.gcoder = null;
    //  debounce timer for the filter's input element
    this.inputTimer = null;
    //  bounce timer for marker bounce animations
    this.bounceTimer = null;
    //  iwin is the Google infoWindow object
    this.iwin = null;
    //  create an object for accessing the Yelp API
    this.yelp = new yelpHelper(localDbase.myYelpAPI);

    this.yelpDetails = [];
  }

  //  ***********************************************************
  //  Methods to service the slide-on/slide-away filter/list
  //  component in mobile views
  //  ***********************************************************
  //  changes flag states to cause re-rendering of the (mobile)
  //  filter/list component whenever it is opened or closed by
  //  clicking on the hamburger icon;
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

  //  handles the end of slide-on or slide-off animation of the (mobile) filter
  //  component: clears the flag that indicates an open or close sequence
  //  is required
  filtAnimateStop() {
    if (this.state.flags & 1) {
      this.flagModifier(1, 'C');
    }
  }
  //  ***********************************************************
  
  //  ***********************************************************
  //  ***********************************************************
  //  methods to access the Yelp Fusion API and initialize place
  //  data for the infoWindow
  //  ***********************************************************
  //  ***********************************************************
  loadAllPlaceInfo() {
  }


  //  ***********************************************************
  //  ***********************************************************
  //  methods to handle loading the Google API, initialize the map,
  //  and create the map's markers
  //  ***********************************************************
  //  ***********************************************************
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
  
  //  initMap is required by the Google Maps API
  initMap(google) {

    //  create the map and geocoder and infoWindow objects
    const mapLocation = localDbase.location;
    const mapObj = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: mapLocation});
    this.gcoder = new google.maps.Geocoder();
    this.iwin = new google.maps.InfoWindow();

    this.iwin.setContent(`<div id="infoWindow"></div>`);
 
    //  create the markers and drop them on the map
    let innerInitMap = (results)=>{
      let marks = results.map(
        item=>new google.maps.Marker({position: item.location, map: mapObj, animation: google.maps.Animation.DROP, title: item.name, visible: true})
      );
      //  add event listeners to open an infoWindow
      marks.forEach(mark=>{
        mark.addListener('click', e=>{this.filterListSelectEvent(mark.getTitle(), e)});
      });
      this.setState({map: mapObj, markers: marks});
    };

    let placesLatLngPromises = this.state.places.map(item=>this.getCoord(google, item));
    Promise.all(placesLatLngPromises).then(
      results=>innerInitMap(results)
    ).catch(e=>console.log(e));
  }

  
  //  lifted from Stackoverflow.com:
  loadGoogleAPI() {
    if (!(this.googlePromise))
    {
      this.googlePromise = new Promise((resolve)=>{
        window.googleLoaded = ()=>{
          resolve(google);
        };
        
        const script = document.createElement("script");
        const API = localDbase.myGoogleAPI;
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
    //  NOTE that this.state.places will change based on the search/filter box input,
    //  but yelpDetails will not, so we can append Yelp-specific information to it
    //  for all available places and keep using it
    this.yelpDetails = getPlaces("all");
    this.setState({places: this.yelpDetails});
    //  start loading the Google API
    this.loadGoogleAPI();

    this.yelpDetails.forEach(item=>{
      this.yelp.getYelpID(item, id=>{item.id = id;});
    });
  }

  componentDidMount() {
    //  load the map and create the markers once the Google API has finished loading
    this.loadGoogleAPI().then((google)=>{window.initMap(google);});
  }
  //  ***********************************************************

  //  ***********************************************************
  //  ***********************************************************
  //  event handlers for the filter/list elements
  //  ***********************************************************
  //  ***********************************************************
  
  //  handle text box input
  filterInputHandler(event) {
    event.preventDefault();
  
    //  if the input has changed within X seconds of the last input, clear the timeout and set it again
    if (this.inputTimer) {
      window.clearTimeout(this.inputTimer);
    }
    //  update the text box
    this.setState({query: event.target.value});
    //  use a timer to prevent immediate updates on map; only 1/4 second after any input change
    this.inputTimer = window.setTimeout(
      ()=>{
        //  get the filtered results
        let newPlaces = getPlaces(this.state.query);
            
        //  update the listed places
        if (!(newPlaces.length)) {
          this.setState({places: []});
        } else {
          this.setState({places: newPlaces});
        }

        //  hide markers which aren't in the filtered results; show markers that are
        this.state.markers.forEach(mark=>{
          if (newPlaces.filter(place=>place.name === mark.getTitle()).length) {
            mark.setVisible(true);
          } else {
            mark.setVisible(false);
          }
        });
      },
      250
    );
  }

  filterListSelectEvent(name, event) {
    let detailPromise;
    let bouncePromise;
    let reviewsPromise;

    //  get the appropriate details object for this place
    let yelpPlace = this.yelpDetails.filter(item=>item.name === name)[0];
    if (yelpPlace.id) {
      //  if we've not loaded the details from Yelp for this place yet, do it now
      if (!yelpPlace.details) {
        //  detailPromise becomes a promise which will hold off rendering the infoWindow
        //  until Yelp details have been loaded using AJAX
        detailPromise = this.yelp.getYelpData(yelpPlace.id, {reviews: false, callback: details=>{
          //  "details" is the entire Yelp response, just tacked onto our object
          yelpPlace.details = details;
          //console.log(details);
        }});
      }

      //  if we've not loaded the reviews from Yelp for this place yet, do it now
      if (!yelpPlace.reviews) {
        reviewsPromise = this.yelp.getYelpData(yelpPlace.id, {reviews: true, callback: reviews=>{
          yelpPlace.reviews = reviews;
          console.log(reviews);
        }});
      }
    }
    //  we could put an "else" here to load data from another source, if Yelp doesn't
    //  give us an ID for a place in our database; but given the time constraints of
    //  this project, I'm only picking places that will return IDs from Yelp

    //  locate the marker that must bounce
    let bouncingMarker = this.state.markers.filter(item=>item.title === name)[0];
    //  get the Google API handle ...
    this.loadGoogleAPI().then(google=>{
      //  start the marker bouncing
      bouncingMarker.setAnimation(google.maps.Animation.BOUNCE);
      if (this.bounceTimer) {
        window.clearTimeout(this.bounceTimer);
      }
      //  now set a promise that resolves when it stops bouncing in a quarter second
      bouncePromise = new Promise((resolve)=>{
        //  allow it to bounce for a quarter second
        this.bounceTimer = window.setTimeout(
          ()=>{
            //  then stop it from bouncing
            bouncingMarker.setAnimation(null);
            resolve();
          },
          250
        );
      });

      //  when both promises resolve -- yelp details received and marker has
      //  stopped bouncing, then render the info window
      Promise.all([bouncePromise, detailPromise, reviewsPromise]).then(()=>{
        //  and set-up to render the InfoWinComponent inside the info window
        //  once the Google infoWindow object has added the infoWindow node
        //  to the DOM
        //  (thanks to https://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
        //  for the example on how to render the React component inside the info window)
        if (this.iwin) {
          this.iwin.addListener('domready', e=>{
            ReactDOM.render(<InfoWinComponent details={yelpPlace.details} reviews={yelpPlace.reviews} />, document.getElementById('infoWindow'));
          });
          this.iwin.open(this.state.map, bouncingMarker);
        }  
      });
    });
  }
  //  *********************************************************** 


  render() {
    return (
      <div className="page-container">
        <AppHeader iconHandler={this.iconHandler} headerText={localDbase.titleText} />        
        <div id="map" role="application"></div>
        <FilterComponent query={this.state.query} queryHandler={this.queryHandler} flags={this.state.flags} places={this.state.places} animationStop={this.animationStop} listSelect={this.listSelect}/>
      </div>
    );
  }
}

export default App;
