import React, { Component } from 'react';
import { Formik } from 'formik';
import PrimaryButton from '../buttons/PrimaryButton';
import validationService from '../../scripts/ValidationService';
import apiService from '../../scripts/ApiService';
import FormErrorMessage from '../messages/FormErrorMessage';
import errorService from '../../scripts/ErrorService';
import './TransactionForm.css';

class TransactionForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			processing: false,
			error: null
		};
	}

	validate = (values) => {
		const { transactionValue } = values;
		let errors = {}, error;

		if (!transactionValue) {
			errors.transactionValue = 'Required';
		} else {
			error = validationService.validateTransactionValue(transactionValue);
			if (error) errors.transactionValue = error;
		}

		return errors;
	}

	handleSubmit = async ({ transactionValue }) => {
		this.setState({
			validated: true,
			processing: true,
			error: null
		});
		try {
			const { offerInstanceIdForSeller, transactionCompletionHandler } = this.props,
				responseData = await apiService.completeTransaction({
					offerInstanceIdForSeller,
					transactionValue
				});
			this.setState({ processing: false });
			transactionCompletionHandler(responseData.transactionId);
		} catch (error) {
			errorService.handleError(error, 'Error completing transaction -', {
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
					initialValues={{ transactionValue: '' }}
					validate={this.validate}
					onSubmit={this.handleSubmit}
					render={props => {
						const { validated, processing, error } = this.state,
							{ values, errors, touched, handleChange, handleBlur, handleSubmit } = props,
							appError = (touched.transactionValue || validated) ? errors.transactionValue : null;

						return (
							<form className="transaction-form" onSubmit={handleSubmit}>
								<div className="large-text">
									<label htmlFor="transactionValue">{'Enter transaction value'}</label>
									<input
										type="text"
										id="transactionValue"
										className="inline-right"
										value={values.transactionValue}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<FormErrorMessage error={appError || error} noItalics={true} />
								<div>
									<PrimaryButton
										type="submit"
										text="Confirm Transaction"
										colourClassName="btn-danger"
										extraClassNames={['confirm-button']}
										disabled={processing}
									/>
								</div>
							</form>
						);
					}}
				/>
			</div>
		);
	}
}

export default TransactionForm;