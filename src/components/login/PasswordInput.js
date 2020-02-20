import React, { Component } from 'react';
import * as config from '../../config';
import './PasswordInput.css';

class PasswordInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}

	handleToggleVisibility = () => {
		this.setState({ visible: !this.state.visible });
	}

	render() {
		const { visible } = this.state,
			{ id, value, changeHandler, registering, isInvalid } = this.props;

		let className = 'password-input-container form-control';
		if (isInvalid) className += ' is-invalid';

		return (
			<div className={className}>
				<input
					type={visible ? 'text' : 'password'}
					id={id}
					value={value}
					maxLength={config.users.password.maxLength}
					onChange={changeHandler}
					autoComplete={registering ? 'new-password' : 'current-password'}
				/>
				<span
					className="toggle-password-vis interactive"
					onClick={this.handleToggleVisibility}
				>{visible ? 'Hide' : 'Show'}</span>
			</div>
		);
	}
}

export default PasswordInput;