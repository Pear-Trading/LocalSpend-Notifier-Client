import React, { Component, Fragment } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import PasswordInput from './PasswordInput';
import * as config from '../../config';
import FormErrorMessage from '../messages/FormErrorMessage';
import errorService from '../../scripts/ErrorService';
import authService from '../../scripts/AuthService';
import withPageChange from '../higherOrder/withPageChange';
import './LogInForm.css';

class LogInForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			processing: false,
			error: null
		};
	}

	handleEmailChange = (event) => {
		this.setState({
			email: event.target.value,
			error: null
		});
	}

	handlePasswordChange = (event) => {
		this.setState({
			password: event.target.value,
			error: null
		});
	}

	handleSubmit = async (event) => {
		event.preventDefault();
		this.setState({
			processing: true,
			error: null
		});
		try {
			const { email, password } = this.state;
			await authService.logIn(email, password);
			this.setState({ processing: false });
			const { pathname, state } = this.props.from;
			this.startPageChangeTimer(pathname, state);
		} catch (error) {
			errorService.handleError(error, 'Error signing in -', {
				component: this,
				setFalseFieldName: 'processing',
				setErrorFieldName: 'error'
			});
		}
	}

	render() {
		const { email, password, processing, error } = this.state;

		return (
			<Fragment>
				<form className="login-form" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="form-label" htmlFor="email">
							{'Email'}
						</label>
						<input
							type="text"
							id="email"
							className="form-control"
							value={email}
							maxLength={config.users.email.maxLength}
							onChange={this.handleEmailChange}
							autoComplete="username"
						/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="password">
							{'Password'}
						</label>
						<PasswordInput
							id="password"
							value={password}
							changeHandler={this.handlePasswordChange}
						/>
					</div>
					<FormErrorMessage error={error} />
					<div className="text-center">
						<PrimaryButton
							type="submit"
							text="Sign In"
							disabled={processing}
						/>
					</div>
				</form>
				<div className="text-center mt-3">
					<a onClick={() => this.startPageChangeTimer('/forgotPassword/')}>{'Forgot password'}</a>
				</div>
			</Fragment>
		);
	}
}

export default withPageChange(LogInForm);