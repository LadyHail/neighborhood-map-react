import React from 'react';

class Header extends React.Component {
    toggleList = () => {
        var list = document.getElementById('list-aside');
        var listStyle = window.getComputedStyle(list);
        if (listStyle.getPropertyValue('display') === 'block') {
            (list.style.display = 'none')
        } else {
            (list.style.display = 'block')
        }           
    }

    render() {
        return (
            <header className="header">
                <button className="menu-btn" onClick={this.toggleList}>Toggle list</button>
                <h1 className="header-title">My places</h1>
            </header>
            )
    }
}

export default Header;
