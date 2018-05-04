import React from 'react';
import ReactDOM from 'react-dom';
/* global google */

// Source: http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
class GoogleMap extends React.Component {
    componentDidMount = () => {
        window.initMap = this.initMap;
        this.loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCRIbdjllR4pFNinaYt0l7DPgKRe9BMNEU&callback=initMap')
    };

    initMap = () => {
        var _this = this;
        var map = new google.maps.Map(ReactDOM.findDOMNode(this.refs.map), {
            center: { lat: 50.905227, lng: 16.086340 },
            zoom: 8
        });

        const coordinates = [
            { location: { lat: 50.736083, lng: 15.739871 }, title: 'Śnieżka Mountain' },
            { location: { lat: 50.827943, lng: 15.973715 }, title: 'Colourful Lakelets' },
            { location: { lat: 50.669641, lng: 16.418253 }, title: 'Project Riese - Complex Osówka' },
            { location: { lat: 50.842194, lng: 16.291567 }, title: 'Książ Castle' },
            { location: { lat: 51.029167, lng: 15.301944 }, title: 'Czocha Castle' }
        ];

        var markers = [];
        var globalInfoWindow = new google.maps.InfoWindow();
        var placesList = document.getElementById('places-list');

        coordinates.forEach(function (place) {
            var marker = new google.maps.Marker({
                position: place.location,
                map: map,
                title: place.title
            });
            markers.push(marker);

            marker.addListener('click', function () {
                _this.populateInfoWindow(marker, globalInfoWindow, map);
            });

            var placeItem = document.createElement('li');
            placeItem.className = 'place';
            placeItem.id = place.title;
            placeItem.textContent = place.title;
            placesList.appendChild(placeItem);
        });

        placesList.addEventListener('click', function (event) {
            var placeId = event.target.id;
            map.setZoom(12);
            var match = (markers.filter(m => m.title === placeId));
            map.setCenter(match[0].position);
        });
    };

    loadJS = (src) => {
        const ref = window.document.getElementsByTagName("script")[0];
        const script = window.document.createElement("script");
        script.src = src;
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
    }

    populateInfoWindow = (marker, infoWindow, map) => {
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent(marker.title);
            infoWindow.open(map, marker);
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
            })
        }
    }

    render() {
        return (
            <div id="map" ref="map" />
            );
    };
}

export default GoogleMap;