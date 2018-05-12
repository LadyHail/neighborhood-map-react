import React, { Component } from 'react';
import './App.css';
import GoogleMap from './GoogleMap';
import Header from './Header';
import Search from './Search';

class App extends Component {
    state = {
        coordinates: [
            { location: { lat: 51.113889, lng: 17.081667 }, title: 'Szczytnicki Park' },
            { location: { lat: 50.827943, lng: 15.973715 }, title: 'Colourful Lakelets' },
            { location: { lat: 51.119444, lng: 17.096667 }, title: 'Olympic Stadium' },
            { location: { lat: 51.109444, lng: 17.033056 }, title: 'Barasch Brothers\' Department Store' },
            { location: { lat: 51.029167, lng: 15.301944 }, title: 'Czocha Castle' }
        ],
        filteredCoords: [],
    }

    componentDidMount = () => {
        this.setState({ filteredCoords: this.state.coordinates });
    }

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
                    <ol className="places-list" id="places-list"></ol>
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
