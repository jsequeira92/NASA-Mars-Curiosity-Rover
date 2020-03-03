import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

//re-usable select component with checkboxes as options
class SelectBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,  //state of the div showing the checkbox options
            checkboxes: {},
            selected: false, //storing the selected checkboxes
            divRef: null  //storing the reference of the div containing the checkbox options
        }
        this.setDivRef = this.setDivRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        const {
            identifier
        } = this.props;
        var checkboxes = document.getElementById(identifier).nextElementSibling;
        this.setState({
            checkboxes
        });
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillMount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    //function to close the div containing the checkbox options when the focus is lost
    handleClickOutside(event) {
        const {
            divRef, checkboxes,
        } = this.state;
        if (divRef && !divRef.contains(event.target)) {
            checkboxes.style.display = 'none';
            this.setState({
                expanded: false
            });
        }
    }

    //function to get and store the reference of the div
    setDivRef(node) {
        this.setState({
            divRef: node
        });
    }

    //function that returns custom template of checkbox option list
    createOptions = (options) => (options.map((o, index) => (
        <div className="checkbox-container">
            <label className="checkbox-label">
                <input type="checkbox" id={index} checked={o.isChecked} onChange={() => this.checkItem(o)} />
                <span className="checkbox-custom">
                </span>
            </label>
            <div className="input-title">{o.label}</div>
        </div>
    )));

    //function triggered based on selection of checkbox
    checkItem = (option) => {
        const {
            handleOnChange
        } = this.props;
        handleOnChange(option);
        this.setState(prevState => {
            return {
                selected: !prevState.selected ? !prevState.selected : prevState.selected
            }
        })
    }

    //function to display the count of selected checkboxes in the select tag
    displaySelectedCount = () => {
        const {
            options
        } = this.props;
        let count = 0;
        options.forEach(opt => {
            if (opt.isChecked) {
                count++;
            }
        })
        if (count === 0) {
            this.setState({
                selected: false
            })
            return null;
        }
        return (
            <option style={{ fontWeight: 'bold', color: '#000' }}>{count} Selected</option>
        );
    }


    //function to hide/display div containing the checkbox option list
    showCheckboxes = () => {
        const {
            checkboxes, expanded
        } = this.state;
        if (!expanded) {
            checkboxes.style.display = "block";
            this.setState({
                expanded: !expanded
            });
        } else {
            checkboxes.style.display = "none";
            this.setState({
                expanded: !expanded
            });
        }
    }

    displayLoader = () => {
        const {
            options
        } = this.props;
        if (options && options.length > 0) {
            return (<option>Select an option...</option>)
        } else {
            return (<option>Loading....</option>)
        }
    }

    render() {
        const {
            options, identifier, selectOrClearAll
        } = this.props;
        const {
            selected
        } = this.state;
        return (
            <form>
                <div className="multi-select">
                    <div className="select-box" id={identifier} onClick={() => this.showCheckboxes()}>
                        <select>
                            {selected ? this.displaySelectedCount() : this.displayLoader()}
                        </select>
                        <div className="overSelect"></div>
                    </div>
                    <div id="checkboxes" ref={this.setDivRef}>
                        <div className="links">
                            <button className="select-all input-title" onClick={(e) => { e.preventDefault(); selectOrClearAll(true); }}>Select All</button>
                            <button className="clear-all input-title" onClick={(e) => { e.preventDefault(); selectOrClearAll(false); }}>Clear</button>
                        </div>
                        {this.createOptions(options)}
                    </div>
                </div>
            </form>
        );
    }
}

SelectBox.propTypes = {
    options: PropTypes.array.isRequired,
    classes: PropTypes.string,
    handleOnChange: PropTypes.func.isRequired,
};

export default SelectBox;