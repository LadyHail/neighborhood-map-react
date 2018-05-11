import React from 'react';

class Header extends React.Component {
    toggleList = () => {
        var list = document.getElementById('list-aside');
        var listStyle = window.getComputedStyle(list);
        var map = document.getElementById('map');

        if (listStyle.getPropertyValue('display') === 'block') {
            list.style.display = 'none';
            map.style.width = '100%';
        } else {
            list.style.display = 'block';
            map.style.width = '70%';
        }           
    }

    render() {
        return (
            <header className="header">
                <button className="menu-btn" onClick={this.toggleList}>Show / hide list</button>
                <h1 className="header-title">My places</h1>
            </header>
            )
    }
}

export default Header;
