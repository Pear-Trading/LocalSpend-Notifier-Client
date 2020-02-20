import React, { Component } from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';
import PrimaryButton from '../buttons/PrimaryButton';
import ErrorMessage from '../messages/ErrorMessage';
import FormErrorMessage from '../messages/FormErrorMessage';
import validationService from '../../scripts/ValidationService';
import * as config from '../../config';
import './AccountSettingsForm.css';

class AccountSettingsForm extends Component {
	constructor(props) {
		super(props);
		this.completeInitialValues = null;
		this.initialValuesSet = false;
		this.state = {
			loading: true,
			loadError: null,
			initialValues: null,
			processing: false,
			submitted: false,
			formError: null
		};
	}

	async componentDidMount() {
		try {
			const responseData = await apiService.getUserAccountDetails();
			this.setState({
				loading: false,
				initialValues: responseData.accountDetails
			});
		} catch (error) {
			errorService.handleError(error, 'Error retrieving account settings -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'loadError'
			});
		}
	}

	validate = (values) => {
		const { name, email, postcode, newPassword, confirmNewPassword, currentPassword } = values;
		let errors = {}, error;

		const requiredFieldNames = { name, email, postcode, currentPassword };
		for (let fieldName in requiredFieldNames) {
			if (!requiredFieldNames[fieldName]) {
				errors[fieldName] = 'Required';
			}
		}

		if (email) {
			error = validationService.validateEmailAddress(email);
			if (error) errors.email = error;
		}
		if (postcode) {
			error = validationService.validatePostcode(postcode);
			if (error) errors.postcode = error;
		}
		if (newPassword) {
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
		this.setState({
			processing: true,
			formError: null
		});
		try {
			const responseData = await apiService.updateUserAccountDetails(values);
			this.setState({ processing: false });
			this.props.submitSuccessHandler(responseData);
		} catch (error) {
			errorService.handleError(error, 'Error updating account settings -', {
				component: this,
				setFalseFieldName: 'processing',
				setErrorFieldName: 'formError'
			});
		}
	}

	render() {
		const { loadError } = this.state;

		if (loadError) {
			return <ErrorMessage error={loadError} />;
		}

		const { initialValues } = this.state;
		let completeInitialValues;

		if (!this.initialValuesSet) {
			if (initialValues) {
				completeInitialValues = initialValues;
				this.initialValuesSet = true;
			} else {
				completeInitialValues = {
					name: '',
					email: '',
					postcode: ''
				};
			}
			completeInitialValues = {
				...completeInitialValues,
				newPassword: '',
				confirmNewPassword: '',
				currentPassword: ''
			};
			this.completeInitialValues = completeInitialValues;
		} else {
			completeInitialValues = this.completeInitialValues;
		}

		return (
			<div className="spaced-children-1">
				<div className="text-center">
					{'All fields are optional '}<strong>{'except'}</strong>{' for Current password'}
				</div>
				<Formik
					initialValues={completeInitialValues}
					enableReinitialize={true}
					validate={this.validate}
					onSubmit={this.handleSubmit}
					componentDidUpdate={() => {
						console.log('componentDidUpdate');
					}}
					render={props => {
						const { values, errors, handleChange, handleSubmit } = props,
							{ processing, submitted, formError } = this.state;

						return (
							<Form
								className="account-settings-form"
								onSubmit={event => this.handleSubmitInitial(event, handleSubmit)}
							>
								<Form.Group controlId="name">
									<Form.Label>{'Name'}</Form.Label>
									<Form.Control
										type="text"
										value={values.name}
										maxLength={config.users.name.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.name != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.name}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="email">
									<Form.Label>{'Email address'}</Form.Label>
									<Form.Control
										type="text"
										value={values.email}
										maxLength={config.users.email.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.email != null}
										autoComplete="username"
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.email}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="postcode">
									<Form.Label>{'Postcode'}</Form.Label>
									<Form.Control
										type="text"
										value={values.postcode}
										maxLength={config.users.postcode.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.postcode != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.postcode}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="newPassword">
									<Form.Label>{'New password'}</Form.Label>
									<Form.Control
										type="password"
										value={values.newPassword}
										maxLength={config.users.password.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.newPassword != null}
										autoComplete="new-password"
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
										autoComplete="new-password"
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.confirmNewPassword}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="currentPassword">
									<Form.Label>{'Current password'}</Form.Label>
									<Form.Control
										type="password"
										value={values.currentPassword}
										maxLength={config.users.password.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.currentPassword != null}
										autoComplete="current-password"
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.currentPassword}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<FormErrorMessage error={formError} />
								<div className="text-center">
									<PrimaryButton
										type="submit"
										text="Update"
										disabled={processing}
									/>
								</div>
							</Form>
						);
					}}
				/>
			</div>
		);
	}
}

export default AccountSettingsForm;