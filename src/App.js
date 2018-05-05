import React, { Component } from 'react';
import './App.css';
import GoogleMap from './GoogleMap';
import Header from './Header';
import Search from './Search';

class App extends Component {
    state = {
        coordinates: [
            { location: { lat: 50.736083, lng: 15.739871 }, title: 'Œnie¿ka Mountain' },
            { location: { lat: 50.827943, lng: 15.973715 }, title: 'Colourful Lakelets' },
            { location: { lat: 50.669641, lng: 16.418253 }, title: 'Project Riese - Complex Osówka' },
            { location: { lat: 50.842194, lng: 16.291567 }, title: 'Ksi¹¿ Castle' },
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
      </div>
    );
  }
}

export default App;
