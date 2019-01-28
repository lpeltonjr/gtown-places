# Neighborhood Map Project

This is a project for Udacity's Front-End Development program.  It is an accessible application which works offline and was created with React.

## Source Files

*   ./src/App.css
*   ./src/index.css
*   ./src/index.js
*   ./src/App.js
*   ./src/AppHeader.js
*   ./src/FilterComponent.js
*   ./src/InfoWinComponent.js
*   ./src/localDbase.js
*   ./src/yelpHelper.js
*   ./src/serviceWorker.js
*   ./src/img/*.png (images provided by Yelp)


## Setup

From the command line, "npm run build".

Then, to serve the website on localhost:5000: "serve -s build"

These are the standard instructions for running a create-react-app application as a production build.

## User Instructions

The website lists several places of interest in a neighborhood of Germantown, Tennessee.  The places are marked on a Google map, and they are listed as results of a search box.

The search term "all" will cause all places to be listed.  Otherwise, enter a search term (such as "store") to filter the places listed.

Selecting a listed place with the mouse or keyboard will open an infoWindow above the associated map marker.  The infoWindow displays a picture and review fetched from Yelp.  The place can also be selected with the mouse by clicking on a map marker.  NOTE that from what I've read, Google does not provide a means of selecting a map marker with the keyboard, thus the map is accessible by virtue of the textual list.  I searched for a way to make the markers selectable with the keyboard, as they were in a previous Udacity project using MapBox.  But I was unable to determine how to do so.

The service worker provided is the default service worker of create-react-app.  I am submitting the project with this service worker due to time contraints. I was concerned that it might not cache Yelp responses, but in fact, it does seem to do so.







