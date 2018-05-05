import React from 'react';
import ReactDOM from 'react-dom';
/* global google */

// Source: http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
class GoogleMap extends React.Component {
    state = {
        coordinates: [],
        isInitialized: false,
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

    populateInfoWindow = (marker, infoWindow, map) => {
        if (infoWindow.marker !== marker) {
            infoWindow.marker = marker;
            infoWindow.setContent(marker.title);
            infoWindow.open(map, marker);
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
            })
        }
    }

    populatePlaces() {
        if (this.markers && this.markers.length !== 0) {
            this.markers.forEach(function (marker) {
                marker.setMap(null);
            });
        } else {
            this.markers = [];
        }
        var _this = this;
        var markers = [];
        var globalInfoWindow = new google.maps.InfoWindow();
        var placesList = document.getElementById('places-list');
        placesList.innerHTML = '';
        this.state.coordinates.forEach(function (place) {
            var marker = new google.maps.Marker({
                position: place.location,
                map: _this.map,
                title: place.title
            });
            markers.push(marker);
            marker.addListener('click', function () {
                _this.populateInfoWindow(marker, globalInfoWindow, _this.map);
            });
            var placeItem = document.createElement('li');
            placeItem.className = 'place';
            placeItem.id = place.title;
            placeItem.textContent = place.title;
            placesList.appendChild(placeItem);
        });
        _this.markers = markers;
        placesList.addEventListener('click', function (event) {
            var placeId = event.target.id;
            _this.map.setZoom(12);
            var match = (markers.filter(m => m.title === placeId));
            _this.map.setCenter(match[0].position);
            _this.populateInfoWindow(match[0], globalInfoWindow, _this.map);
        });
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