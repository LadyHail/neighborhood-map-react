import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GoogleMap from './GoogleMap';
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div className="App">
            <Header />
            <main>
                <aside>
                    <span>
                        <input className="search-box" placeholder="ex. park"></input>
                        <button className="search-button">Filter</button>
                    </span>
                    <ol className="places-list" id="places-list"></ol>
                </aside>
                <GoogleMap />
            </main>
      </div>
    );
  }
}

export default App;
