import React from 'react';

class Header extends React.Component {

    // There are different map width depending on device. It's necessery to keep initial map width.
    componentDidMount = () => {
        this.map = document.getElementById('map');
        this.mapInitWidth = this.getMapWidth();
    }

    // Get initial map width.
    getMapWidth = () => {        
        var mapWidth = this.map.style.width;
        return mapWidth;
    }

    // Show or hide the list of places.
    toggleList = () => {
        var list = document.getElementById('list-aside');
        var listStyle = window.getComputedStyle(list);

        if (listStyle.getPropertyValue('display') === 'block') {
            list.style.display = 'none';
            this.map.style.width = '100%';
        } else {
            list.style.display = 'block';
            this.map.style.width = this.mapInitWidth;
        }           
    }

    render() {
        return (
            <header className="header">
                <button className="menu-btn" onClick={this.toggleList}>Show / hide list</button>
                <h1 className="header-title">Lower Silesia Places</h1>
            </header>
            )
    }
}

export default Header;
