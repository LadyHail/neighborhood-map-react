import React from 'react';

class Search extends React.Component {
    state = {
        query: ''
    }

    updateQuery = (query) => {
        var places;
        if (query) {
            this.setState({ query });
            places = this.props.coordinates.filter(e => e.title.match(new RegExp(query, "i")));
            this.props.updateCoords(places);
        } else {
            this.setState({ query: '' });
            places = this.props.coordinates;
            this.props.updateCoords(places);
        }
    }

    render() {
        return (
                <input
                    type="text"
                    className="search-box"
                    placeholder="ex. park"
                    value={this.state.query}
                    onChange={(event => this.updateQuery(event.target.value))}
                />
            )
    }
}

export default Search;