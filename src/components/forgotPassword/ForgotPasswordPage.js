import React, { Fragment } from 'react';
import { Form } from 'react-bootstrap';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import withRedirectIfLoggedIn from '../higherOrder/withRedirectIfLoggedIn';
import PrimaryButton from '../buttons/PrimaryButton';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';
import SuccessMessage from '../messages/SuccessMessage';
import FormErrorMessage from '../messages/FormErrorMessage';
import * as config from '../../config';
import withAnimations from '../higherOrder/withAnimations';

class ForgotPasswordPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.mainPanelOptions = {
			showTitle: true,
			title: 'Forgot Password',
			extraClassNames: ['text-center']
		};
		this.state = {
			email: '',
			processing: false,
			success: false,
			error: null
		};
	}

	handleEmailChanged = (event) => {
		this.setState({ email: event.target.value });
	}

	handleSubmit = async (event) => {
		event.preventDefault();
		const { email } = this.state;
		if (!email) return;
		this.setState({
			processing: true
		});
		try {
			await apiService.forgotPassword({ email });
			this.setState({
				processing: false,
				success: true
			});
		} catch (error) {
			errorService.handleError(error, 'Error submitting email -', {
				component: this,
				setFalseFieldName: 'processing',
				setErrorFieldName: 'error'
			});
		}
	}

	renderMainPanel = () => {
		if (this.state.success) {
			this.mainPanelOptions.showTitle = false;
			this.mainPanelOptions.extraClassNames.push('success');
		}
		return super.renderMainPanel();
	}

	renderMainPanelContents = () => {
		const { processing, success, error } = this.state;

		if (success) {
			return (
				<SuccessMessage
					primaryMessage={'Success!'}
					secondaryMessage={'If registered, you should receive an email to reset your password very shortly'}
				/>
			);
		}

		return (
			<Fragment>
				<Form onSubmit={event => this.handleSubmit(event)}>
					<Form.Group>
						<Form.Control
							type="text"
							placeholder="Enter your email here"
							maxLength={config.users.email.maxLength}
							onChange={this.handleEmailChanged}
							autoComplete="username"
						/>
					</Form.Group>
					<FormErrorMessage error={error} hideIfNoError={true} />
					<PrimaryButton
						type="submit"
						text="Submit"
						disabled={processing}
					/>
				</Form>
			</Fragment>
		);
	}
}

export default compose(withRedirectIfLoggedIn, withAnimations)(ForgotPasswordPage);