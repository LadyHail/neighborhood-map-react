import React, { Component } from 'react';
import './App.css';
import GoogleMap from './GoogleMap';
import Header from './Header';
import Search from './Search';

class App extends Component {
    state = {
        coordinates: [
            { location: { lat: 51.113889, lng: 17.081667 }, title: 'Szczytnicki Park', details: '' },
            { location: { lat: 50.827943, lng: 15.973715 }, title: 'Colourful Lakelets', details: '' },
            { location: { lat: 51.119444, lng: 17.096667 }, title: 'Olympic Stadium', details: '' },
            { location: { lat: 51.109444, lng: 17.033056 }, title: 'Barasch Brothers\' Department Store', details: '' },
            { location: { lat: 51.029167, lng: 15.301944 }, title: 'Czocha Castle', details: '' }
        ],
        filteredCoords: [],
    }

    // Initialize coordinates that are displayed on the page.
    componentDidMount = () => {
        this.setState({ filteredCoords: this.state.coordinates });
    }

    // Update coordinates from Search component.
    updateCoords = (places) => {
        this.setState({ filteredCoords: places });
    }

    render() {
    return (
      <div className="App">
            <Header />
            <main>
                <aside id="list-aside">
                    <Search coordinates={this.state.coordinates} updateCoords={this.updateCoords}/>
                    <ul className="places-list" id="places-list" role="list"></ul>
                </aside>
                <GoogleMap coordinates={this.state.filteredCoords} />
            </main>
            <footer>
                <p>Additional information about places is provided by
                    <a href="https://en.wikipedia.org" className="data-provider"> Wikipedia</a>.
                </p>
            </footer>
      </div>
    );
  }
}

export default App;
