import React, { Component } from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import apiService from '../../scripts/ApiService';
import validationService from '../../scripts/ValidationService';
import * as config from '../../config';
import PrimaryButton from '../buttons/PrimaryButton';
import LoadingMessage from '../messages/LoadingMessage';
import ErrorMessage from '../messages/ErrorMessage';
import FormErrorMessage from '../messages/FormErrorMessage';
import errorService from '../../scripts/ErrorService';
import './RegisterForm.css';

class RegisterForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			loadError: null,
			accountTypes: [],
			processing: false,
			submitted: false,
			formError: null
		};
	}

	async componentDidMount() {
		try {
			const responseData = await apiService.getPublicAccountTypes(),
				accountTypes = responseData.accountTypes.map(responseType => {
					const { id } = responseType,
						name = id[0].toUpperCase() + id.slice(1);
					return {
						id,
						name
					};
				});
			this.setState({
				loading: false,
				accountTypes
			});
		} catch (error) {
			errorService.handleError(error, 'Error loading form data -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'loadError'
			});
		}
	}

	validate = (values) => {
		const { name, email, postcode, password, confirmPassword } = values;
		let errors = {}, error;

		const textValues = { name, email, postcode, password };
		for (let value in textValues) {
			if (!textValues[value]) {
				errors[value] = 'Required';
			}
		}

		/*if (name) {
			error = validationService.validateUserName(name);
			if (error) errors.name = error;
		}*/
		if (email) {
			error = validationService.validateEmailAddress(email);
			if (error) errors.email = error;
		}
		if (postcode) {
			error = validationService.validatePostcode(postcode);
			if (error) errors.postcode = error;
		}
		if (password) {
			error = validationService.validatePassword(password);
			if (error) errors.password = error;
		}
		
		if (confirmPassword !== password) {
			errors.confirmPassword = 'Passwords do not match';
		}

		return errors;
	}

	handleSubmitInitial = (event, callback) => {
		event.preventDefault();
		this.setState({ submitted: true });
		callback();
	}

	handleSubmit = async (values) => {
		console.log('handleSubmit', values);
		this.setState({
			submitted: true,
			processing: true,
			formError: null
		});
		try {
			await apiService.register({
				user: values
			});
			this.setState({ processing: false });
			this.props.submitSuccessHandler();
		} catch (error) {
			errorService.handleError(error, 'Error registering -', {
				component: this,
				setFalseFieldName: 'processing',
				setErrorFieldName: 'formError'
			});
		}
	}

	render() {
		const { loading, loadError } = this.state;

		if (loading) {
			return <LoadingMessage />;
		} else if (loadError) {
			return <ErrorMessage error={loadError} />;
		}

		const { accountTypes } = this.state;

		return (
			<div>
				<Formik
					initialValues={{
						accountType: accountTypes[0].id,
						name: '',
						email: '',
						postcode: '',
						password: '',
						confirmPassword: ''
					}}
					validate={this.validate}
					onSubmit={this.handleSubmit}
					render={props => {
						const { values, errors, handleChange, handleSubmit } = props,
							{ accountTypes, processing, submitted, formError } = this.state;

						return (
							<Form className="register-form" onSubmit={event => this.handleSubmitInitial(event, handleSubmit)}>
								<Form.Group controlId="accountType">
									<Form.Label>{'Account Type'}</Form.Label>
									<Form.Control
										as="select"
										value={values.accountType}
										onChange={handleChange}
									>
										{accountTypes.map(type => (
											<option key={type.id} value={type.id}>{type.name}</option>
										))}
									</Form.Control>
								</Form.Group>
								<Form.Group controlId="name">
									<Form.Label>{'Name'}</Form.Label>
									<Form.Control
										type="text"
										value={values.name}
										placeholder="Enter the name relevant to your account type"
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
									<Form.Label>{'Email'}</Form.Label>
									<Form.Control
										type="text"
										value={values.email}
										maxLength={config.users.email.maxLength}
										onChange={handleChange}
										autoComplete="username"
										isInvalid={submitted && errors.email != null}
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
								<Form.Group controlId="password">
									<Form.Label>{'Password'}</Form.Label>
									<Form.Control
										type="password"
										value={values.password}
										maxLength={config.users.password.maxLength}
										onChange={handleChange}
										autoComplete="new-password"
										isInvalid={submitted && errors.password != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.password}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="confirmPassword">
									<Form.Label>{'Confirm password'}</Form.Label>
									<Form.Control
										type="password"
										value={values.confirmPassword}
										maxLength={config.users.password.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.confirmPassword != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.confirmPassword}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<FormErrorMessage error={formError} />
								<div className="text-center">
									<PrimaryButton
										type="submit"
										text="Register"
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

export default RegisterForm;