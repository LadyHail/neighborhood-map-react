import React from 'react';
import ReactDOM from 'react-dom';
/* global google */

// Source: http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
class GoogleMap extends React.Component {
    constructor(props) {
        super(props);
        this.markers = [];
        this.map = {};
        this.infoWindow = {};
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

    static getDerivedStateFromProps = (nextProps, prevState) => {
        prevState.coordinates = nextProps.coordinates;

        return prevState;
    }

    initMap = () => {
        var map = new google.maps.Map(ReactDOM.findDOMNode(this.refs.map), {
            center: { lat: 50.905227, lng: 16.086340 },
            zoom: 8
        });
        this.map = map;
        this.infoWindow = new google.maps.InfoWindow();
        this.populatePlaces();
        this.setState({ isInitialized: true });
    };

    loadJS = (src) => {
        const ref = window.document.getElementsByTagName("script")[0];
        const script = window.document.createElement("script");
        script.src = src;
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
    }

    getInfoWindowContent = (title) => {
        var content = this.state.placeInfo.slice(0, 150);
        var link = '<a href="https://en.wikipedia.org/wiki/' + title + '">Learn more</a>';
        return ('<div class="info-window">' + content + '...' + link + '</div>');
    }

    populateInfoWindow(marker) {
        if (this.infoWindow.marker !== marker) {
            this.infoWindow.marker = marker;
            this.infoWindow.setContent(this.getInfoWindowContent(marker.title));
            this.infoWindow.open(this.map, marker);
        }
    }

    requestMoreInfo = (marker) => {
        var info = '';
        const FETCH_TIMEOUT = 2000;
        let isTimedOut = false;

        new Promise(function (resolve, reject) {
            const timeout = setTimeout(function () {
                isTimedOut = true;
                reject(new Error('Request timed out!'));
            }, FETCH_TIMEOUT);
        
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
            for (var [key, value] of Object.entries(data.query.pages)) {
                if (key !== '-1') {
                    info = value.extract;
                    this.setState({ placeInfo: info });
                    this.populateInfoWindow(marker)
                } else {
                    this.setState({ placeInfo: 'It\'s mystery place! We couldn\'t get more information!' });
                    this.populateInfoWindow(marker);
                }
                }
            }).catch(error => {
                this.setState({ placeInfo: 'Oops... Something went wrong.' });
                this.populateInfoWindow(marker);
            });           
    };

    populatePlaces() {
        this.clearMarkersMap();
        var _this = this;       
        var placesList = this.setPlacesList();
        this.setMarkers(placesList);
        
        placesList.addEventListener('click', function (event) {
            var placeId = event.target.id;
            _this.map.setZoom(12);
            var match = (_this.markers.filter(m => m.title === placeId));
            _this.map.setCenter(match[0].position);
            _this.requestMoreInfo(match[0]);
        });
    }

    clearMarkersMap = () => {
        if (this.markers.length !== 0) {
            this.markers.forEach(function (marker) {
                marker.setMap(null);
            });
        }
    }

    setPlacesList = () => {
        var placesList = document.getElementById('places-list');
        placesList.innerHTML = '';
        var newPlacesList = placesList.cloneNode(true);
        placesList.parentNode.replaceChild(newPlacesList, placesList);
        return newPlacesList;
    }

    setMarkers = (placesListElement) => {
        var _this = this;
        var markers = [];
        this.state.coordinates.forEach(function (place) {
            var marker = new google.maps.Marker({
                position: place.location,
                map: _this.map,
                title: place.title
            });
            markers.push(marker);
            marker.addListener('click', function () {
                _this.requestMoreInfo(marker);
            });
            var placeItem = _this.createPlaceItemElement(place.title);
            placesListElement.appendChild(placeItem);
        });
        _this.markers = markers;
    }

    createPlaceItemElement = (placeTitle) => {
        var placeItem = document.createElement('li');
        placeItem.className = 'place';
        placeItem.id = placeTitle;
        placeItem.textContent = placeTitle;
        return placeItem;
    }

    render() {
        if (this.state.isInitialized) {
            this.populatePlaces();
        }      
        return (
            <div id="map" ref="map" />
        );
    };
}

export default GoogleMap;