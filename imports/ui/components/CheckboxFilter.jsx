import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export class CheckboxFilter extends React.Component {
    
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.isFiltered = this.isFiltered.bind(this);
    }

    filter(event) {
        if (this.refs.falseCheckbox.checked && this.refs.trueCheckbox.checked) {
            // all checkboxes are checked means we want to remove the filter for this column
            this.props.filterHandler();
        } 
        else {
            this.props.filterHandler({ callback: this.isFiltered });
        }
    }

    isFiltered(targetValue) {
        if (targetValue === undefined || targetValue === false || targetValue === 0  || targetValue === '') {
            return (this.refs.falseCheckbox.checked);
        } 
        else {
            return (this.refs.trueCheckbox.checked);
        }
    }

    render() {
        return (
            <div>
                <input ref='trueCheckbox' type='checkbox' className='filter' onChange={ this.filter } defaultChecked={ true } /><T>{ this.props.textTrue }</T>
                &nbsp;&frasl;&nbsp;
                <input ref='falseCheckbox' type='checkbox' className='filter' onChange={ this.filter } defaultChecked={ true } /><T>{ this.props.textFalse }</T>
            </div>
        );
    }
}

CheckboxFilter.propTypes = {
    filterHandler: React.PropTypes.func.isRequired,
    textTrue: React.PropTypes.string,
    textFalse: React.PropTypes.string
};

CheckboxFilter.defaultProps = {
    textTrue: 'True',
    textFalse: 'False'
};

export function TrueFalseFilter(filterHandler, customFilterParameters) {
    return (
        <CheckboxFilter filterHandler={ filterHandler } textTrue={ customFilterParameters.textTrue } textFalse={ customFilterParameters.textFalse } />
    );
}

  
