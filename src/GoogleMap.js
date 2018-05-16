import React from 'react';
import ReactDOM from 'react-dom';
import MarkerIcon from './marker-icon.png';
import PropTypes from 'prop-types';
/* global google */

// Basic implementation source: http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
class GoogleMap extends React.Component {
    constructor(props) {
        super(props);
        this.markers = [];
        this.activeMarker = {};
        this.map = {};
        this.infoWindow = {};
    }

    static propTypes = {
        coordinates: PropTypes.array.isRequired,
    }

    state = {
        coordinates: [],
        isInitialized: false,
        placeInfo: ''
    }

    componentDidMount = () => {
        window.initMap = this.initMap;
        this.loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCRIbdjllR4pFNinaYt0l7DPgKRe9BMNEU&callback=initMap');
    };

    // Set actual coordinates based on Search component
    static getDerivedStateFromProps = (nextProps, prevState) => {
        prevState.coordinates = nextProps.coordinates;

        return prevState;
    }

    // Initialize Google Map
    initMap = () => {
        const map = new google.maps.Map(ReactDOM.findDOMNode(this.refs.map), {
            center: { lat: 50.905227, lng: 16.086340 },
            zoom: 8
        });
        this.map = map;
        this.infoWindow = new google.maps.InfoWindow();
        this.initMarkers();
        this.setPlacesList();
        this.setState({ isInitialized: true });
    };

    // Initialize markers and save them to variable.
    initMarkers = () => {
        const _this = this;
        this.state.coordinates.forEach(function (place) {
            const marker = new google.maps.Marker({
                position: place.location,
                map: _this.map,
                title: place.title,
                icon: MarkerIcon
            });
            _this.markers.push(marker);
            marker.addListener('click', function () {
                _this.activeMarker = marker;
                _this.requestMoreInfo(marker);
            });
        });
    }

    // Setup places list and add event listener to the list.
    setPlacesList = () => {
        const _this = this;
        const placesList = this.clearPlacesList();
        this.state.coordinates.forEach(function (place) {
            _this.addPlaceToList(place, placesList);
        });

        placesList.addEventListener('click', function (event) {
            if (event.target.className === 'place') {                
                const placeId = event.target.id;
                _this.map.setZoom(12);
                const match = _this.markers.filter(m => m.title === placeId);
                _this.map.setCenter(match[0].position);
                _this.activeMarker = match[0];
                _this.requestMoreInfo(match[0]);
            }
        });
    }

    // Setup animation for active marker.
    setActiveMarkerAnimation = (value) => {
        if (Object.keys(this.activeMarker).length !== 0) {
                this.activeMarker.setAnimation(value);
        }
    }

    // Load the script that refer to google maps
    loadJS = (src) => {
        const ref = window.document.getElementsByTagName("script")[0];
        const script = window.document.createElement("script");
        script.src = src;
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
    }

    // Set the content of infoWindow element. Based on clicked marker.
    setInfoWindowContent = (title) => {
        var content = this.state.placeInfo.slice(0, 150);
        var link = '<a href="https://en.wikipedia.org/wiki/' + title + '">Learn more</a>';
        return ('<div class="info-window">' + content + '...' + link + '</div>');
    }

    // Display infoWindow element, just above clicked marker.
    populateInfoWindow(marker) {
        if (this.infoWindow.marker !== marker) {
            this.infoWindow.marker = marker;
            this.infoWindow.setContent(this.setInfoWindowContent(marker.title));
            this.infoWindow.open(this.map, marker);
        }
    }

    // Get more information about place from Wikipedia EN.
    requestMoreInfo = (marker) => {
        this.setActiveMarkerAnimation(null);
        var info = '';
        const FETCH_TIMEOUT = 2000;
        let isTimedOut = false;

        new Promise(function (resolve, reject) {
            const timeout = setTimeout(function () {
                isTimedOut = true;
                reject(new Error('Request timed out!'));
            }, FETCH_TIMEOUT);

            // Request only 'intro' information about place. If intro info is not available returns proper information.
            fetch('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&origin=*&titles=' + marker.title, {
                method: 'POST',
                headers: new Headers({
                    'Api-User-Agent': 'MyPlaces'
                })
            }).then(function (response) {
                clearTimeout(timeout);
                if (!isTimedOut) {
                    resolve(response);
                }
            }).catch(function (error) {
                if (isTimedOut) {
                    return;
                }
                reject(error);
            });
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok!');
            }).then(data => {
            // data returns object that contains pageid which is unique for each article at Wikipedia.                
                info = this.getWikipediaInfo(data);
                if (info !== null) {
                    this.setState({ placeInfo: info });                    
                } else {
                    this.setState({ placeInfo: 'It\'s mystery place! We couldn\'t get more information!' });
                }
                this.populateInfoWindow(marker);
                this.setActiveMarkerAnimation(google.maps.Animation.BOUNCE);
            }).catch(error => {
                this.setState({ placeInfo: 'Oops... Something went wrong.' });
                this.populateInfoWindow(marker);
            });           
    };

    // The function go through all properties of the object, then set info variable with proper data.
    getWikipediaInfo = (data) => {
        for (var [key, value] of Object.entries(data.query.pages)) {
            if (key !== '-1') {
                return value.extract;                
            }
            return null;
        }
    }

    // Reinitialize places list element. It's necessery to clear all events listeners. 
    // Otherwise the event listeners was added multiply.
    clearPlacesList = () => {
        var placesList = document.getElementById('places-list');
        placesList.innerHTML = '';
        var newPlacesList = placesList.cloneNode(true);
        placesList.parentNode.replaceChild(newPlacesList, placesList);
        return newPlacesList;
    }

    // Append place to list.
    addPlaceToList = (place, placesList) => {
        const placeItem = this.createPlaceItemElement(place.title);
        placesList.appendChild(placeItem);
    }

    // Creates place element.
    createPlaceItemElement = (placeTitle) => {
        var placeItem = document.createElement('li');
        placeItem.className = 'place';
        placeItem.setAttribute('role', 'listitem');
        placeItem.setAttribute('aria-label', placeTitle);
        placeItem.id = placeTitle;
        placeItem.textContent = placeTitle;
        return placeItem;
    }

    applyFilter = () => {
        var _this = this;
        var showMarkers = this.markers.filter(m => (this.state.coordinates.find(c => c.title === m.title)));
        this.markers.forEach(function (item) {
            if (!showMarkers.includes(item)) {
                item.setMap(null);
            } else {
                item.setMap(_this.map);
            }
        });
        this.setPlacesList();
    }

    render() {
        if (this.state.isInitialized) {
            this.applyFilter();
        }      
        return (
            <div id="map" ref="map" role="application"/>
        );
    };
}

export default GoogleMap;