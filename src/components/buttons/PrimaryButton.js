import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class PrimaryButton extends Component {
	constructor(props) {
		super(props);
		this.className = props.className || '';
		if (props.largeText !== false) {
			this.addClassNames(['large-text']);
		}
		this.variant = props.variant || 'primary';
	}

	addClassNames = (names) => {
		if (this.className !== '') {
			this.className += ' ';
		}
		this.className += names.join(' ');
	}

	render() {
		const { text, type, clickHandler, disabled } = this.props;
		return (
			<Button
				type={type || 'button'}
				className={this.className}
				variant={this.variant}
				onClick={clickHandler}
				disabled={disabled || false}
			>{text}</Button>
		);
	}
}

export default PrimaryButton;