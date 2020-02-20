import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Formik } from 'formik';
import PrimaryButton from '../buttons/PrimaryButton';
import validationService from '../../scripts/ValidationService';
import * as config from '../../config';
import FormErrorMessage from '../messages/FormErrorMessage';
import errorService from '../../scripts/ErrorService';
import apiService from '../../scripts/ApiService';

class PasswordResetForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			processing: false,
			error: null
		};
	}

	validate = (values) => {
		const { newPassword, confirmNewPassword } = values;
		let errors = {}, error;

		if (!newPassword) {
			errors.newPassword = 'Required';
		} else {
			error = validationService.validatePassword(newPassword);
			if (error) errors.newPassword = error;
		}

		if (confirmNewPassword !== newPassword) {
			errors.confirmNewPassword = 'Passwords do not match';
		}

		return errors;
	}

	handleSubmitInitial = (event, callback) => {
		event.preventDefault();
		this.setState({ submitted: true });
		callback();
	}

	handleSubmit = async (values) => {
		this.setState({ processing: true });
		try {
			const { resetId, successHandler } = this.props;
			await apiService.updateForgottenPassword({
				resetId,
				password: values.newPassword
			});
			successHandler();
		} catch (error) {
			errorService.handleError(error, 'Error resetting password -', {
				component: this,
				setFalseFieldName: 'processing',
				setErrorFieldName: 'error'
			});
		}
	}

	render() {
		return (
			<Formik
				initialValues={{
					newPassword: '',
					confirmNewPassword: ''
				}}
				validate={this.validate}
				onSubmit={this.handleSubmit}
				render={props => {
					const { values, errors, handleChange, handleSubmit } = props,
						{ submitted, processing, error } = this.state;

					return (
						<Form onSubmit={event => this.handleSubmitInitial(event, handleSubmit)}>
							<Form.Group controlId="newPassword">
								<Form.Label>{'New password'}</Form.Label>
								<Form.Control
									type="password"
									value={values.newPassword}
									maxLength={config.users.password.maxLength}
									onChange={handleChange}
									autoComplete="new-password"
									isInvalid={submitted && errors.newPassword != null}
								/>
								{submitted && (
									<Form.Control.Feedback type="invalid">
										{errors.newPassword}
									</Form.Control.Feedback>
								)}
							</Form.Group>
							<Form.Group controlId="confirmNewPassword">
								<Form.Label>{'Confirm new password'}</Form.Label>
								<Form.Control
									type="password"
									value={values.confirmNewPassword}
									maxLength={config.users.password.maxLength}
									onChange={handleChange}
									isInvalid={submitted && errors.confirmNewPassword != null}
								/>
								{submitted && (
									<Form.Control.Feedback type="invalid">
										{errors.confirmNewPassword}
									</Form.Control.Feedback>
								)}
							</Form.Group>
							<FormErrorMessage error={error} />
							<div className="text-center">
								<PrimaryButton
									type="submit"
									text="Submit"
									disabled={processing}
								/>
							</div>
						</Form>
					);
				}}
			/>
		);
	}
}

export default PasswordResetForm;