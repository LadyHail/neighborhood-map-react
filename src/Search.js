import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {
    static propTypes = {
        coordinates: PropTypes.array.isRequired,
        updateCoords: PropTypes.func.isRequired
    }

    state = {
        query: ''
    }

    // Update query everytime user enter the character.
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