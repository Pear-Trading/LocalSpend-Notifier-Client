import React, { Component } from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import validationService from '../../scripts/ValidationService';
import dateService from '../../scripts/DateService';
import apiService from '../../scripts/ApiService';
import * as config from '../../config';
import PrimaryButton from '../buttons/PrimaryButton';
import FormErrorMessage from '../messages/FormErrorMessage';
import errorService from '../../scripts/ErrorService';
import './OfferForm.css';

class OfferForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			processing: false,
			error: null,
			inputEnterAnimationComplete: false,
			validFromCustomEnabled: false
		};
		this.defaultDateTimeString = dateService.convertDateToInputString(new Date(), 'datetime-local');
	}

	handleInputTransitionEnd = () => {
		if (!this.state.inputEnterAnimationComplete) {
			this.setState({ inputEnterAnimationComplete: true });
		}
	}

	handleValidFromCustomToggled = () => {
		const validFromCustomEnabled = !this.state.validFromCustomEnabled;
		return new Promise(resolve => {
			this.setState(
				{ validFromCustomEnabled },
				resolve
			);
		});
	}

	validate = (values) => {
		const { description, dealValue, validFrom, validUntil, numUses } = values,
			{ validFromCustomEnabled } = this.state;
		let errors = {}, error;

		if (!description) {
			errors.description = 'Required';
		}
		if (numUses === '') {
			errors.numUses = 'Required';
		}

		if (dealValue) {
			error = validationService.validateDealValue(dealValue);
			if (error) errors.dealValue = error;
		}

		const validityErrors = validationService.validateOfferValidityDates(validFrom, validUntil, validFromCustomEnabled);
		if (validityErrors.validFrom) {
			errors.validFrom = validityErrors.validFrom;
		}
		if (validityErrors.validUntil) {
			errors.validUntil = validityErrors.validUntil;
		}

		if (numUses) {
			error = validationService.validateOfferNumberOfUses(numUses);
			if (error) errors.numUses = error;
		}

		return errors;
	}

	// workaround - handleSubmit is not called without first successfully validating values
	// but want errors to show after form has been submitted for the first time
	handleSubmitInitial = (event, callback) => {
		event.preventDefault();
		this.setState({ submitted: true });
		callback();
	}

	handleSubmit = async (values) => {
		console.log('handleSubmit', values);
		this.setState({
			processing: true,
			error: null
		});
		try {
			await apiService.postOffer({
				offer: values
			});
			this.setState({ processing: false });
			this.props.submitSuccessHandler();
		} catch (error) {
			errorService.handleError(error, 'Error posting offer -', {
				component: this,
				setFalseFieldName: 'processing',
				setErrorFieldName: 'error'
			});
		}
	}

	render() {
		return (
			<div>
				<Formik
					initialValues={{
						description: 'Website design 20% off for the next 48 hours!',
						dealValue: '20%',
						validFrom: this.defaultDateTimeString,
						validFromCustom: false,
						validUntil: this.defaultDateTimeString,
						numUses: 1
					}}
					validate={this.validate}
					onSubmit={this.handleSubmit}
					render={props => {
						const { submitted, processing, error, inputEnterAnimationComplete, validFromCustomEnabled } = this.state,
							{ animate } = this.props,
							{ values, errors, handleChange, handleSubmit, validateForm } = props;

						let inputClassName;
						if (inputEnterAnimationComplete) {
							inputClassName = 'animated';
						} else if (animate) {
							inputClassName = 'animate';
						} else {
							inputClassName = null;
						}

						return (
							<Form className="offer-form" onSubmit={event => this.handleSubmitInitial(event, handleSubmit)}>
								<Form.Group controlId="description">
									<Form.Label>{'Description'}</Form.Label>
									<Form.Control
										type="text"
										className={inputClassName}
										value={values.description}
										placeholder="Enter a description for your offer here"
										maxLength={config.offers.description.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.description != null}
										onTransitionEnd={this.handleInputTransitionEnd}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.description}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="dealValue">
									<Form.Label>{'Deal value'}</Form.Label>
									<Form.Control
										type="text"
										className={inputClassName}
										value={values.dealValue}
										placeholder="Enter a £ or % discount here (e.g. '25%', '£10', or '75p')"
										maxLength={config.offers.dealValue.maxLength}
										onChange={handleChange}
										isInvalid={submitted && errors.dealValue != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.dealValue}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="validUntil">
									<Form.Label>{'Valid until'}</Form.Label>
									<Form.Control
										type="datetime-local"
										className={inputClassName}
										value={values.validUntil}
										onChange={handleChange}
										isInvalid={submitted && errors.validUntil != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.validUntil}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group className="no-bottom-margin">
									<Form.Check
										type="checkbox"
										id="validFromCustom"
										className="d-inline-block"
										value={values.validFromCustom}
										onChange={async (event) => {
											handleChange(event);
											await this.handleValidFromCustomToggled();
											validateForm();
										}}
									/>
									<Form.Label>
										<div className="d-inline-block">{'Valid from'}</div>
										<div className="d-inline-block label-subtext inline-right">{'Optional - starts at time of submission if left disabled'}</div>
									</Form.Label>
								</Form.Group>
								<Form.Group controlId="validFrom">
									<Form.Control
										type="datetime-local"
										className={inputClassName}
										value={values.validFrom}
										onChange={handleChange}
										disabled={!validFromCustomEnabled}
										isInvalid={submitted && errors.validFrom != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.validFrom}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<Form.Group controlId="numUses">
									<Form.Label>
										<div className="d-inline-block">{'Number of uses per customer'}</div>
										<div className="d-inline-block label-subtext inline-right">{'For unlimited uses enter 0'}</div>
									</Form.Label>
									<Form.Control
										type="number"
										className={inputClassName}
										value={values.numUses}
										onChange={handleChange}
										isInvalid={submitted && errors.numUses != null}
									/>
									{submitted && (
										<Form.Control.Feedback type="invalid">
											{errors.numUses}
										</Form.Control.Feedback>
									)}
								</Form.Group>
								<FormErrorMessage error={error} />
								<div className="text-center">
									<PrimaryButton
										type="submit"
										text="Make Offer Live"
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

export default OfferForm;