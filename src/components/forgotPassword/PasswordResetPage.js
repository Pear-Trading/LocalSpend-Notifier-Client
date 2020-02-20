import React from 'react';
import { Redirect } from 'react-router-dom';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import SuccessMessage from '../messages/SuccessMessage';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';
import ErrorMessage from '../messages/ErrorMessage';
import PasswordResetForm from './PasswordResetForm';
import withRedirectIfLoggedIn from '../higherOrder/withRedirectIfLoggedIn';
import LoadingMessage from '../messages/LoadingMessage';

const REDIRECT_WAIT_TIME = 3000;

class PasswordResetPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.redirectTimer = null;
		this.mainPanelOptions = {
			showTitle: true,
			title: 'Password Reset'
		};
		this.state = {
			loading: true,
			loadError: null,
			success: false,
			redirect: false
		};
	}

	componentDidMount() {
		this.checkIdIsValid(this.props.match.params.id);
	}

	componentWillUnmount() {
		if (this.redirectTimer) {
			clearTimeout(this.redirectTimer);
		}
	}

	async checkIdIsValid(id) {
		try {
			const responseData = await apiService.checkPasswordResetId({
				id
			});
			const { valid, reason } = responseData;
			if (!valid) {
				this.setState({
					loading: false,
					loadError: {
						primary: reason
					}
				});
			} else {
				this.setState({ loading: false });
			}
		} catch (error) {
			errorService.handleError(error, 'Error checking ID is valid -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'loadError'
			});
		}
	}

	handleSuccess = () => {
		this.setState(
			{ success: true },
			this.setRedirectTimer
		);
	}

	setRedirectTimer = () => {
		this.redirectTimer = setTimeout(
			() => this.setState({ redirect: true }),
			REDIRECT_WAIT_TIME
		);
	}

	renderMainPanel = () => {
		if (this.state.success) {
			this.mainPanelOptions.showTitle = false;
			this.mainPanelOptions.extraClassNames = ['text-center', 'success'];
		}
		return super.renderMainPanel();
	}

	renderMainPanelContents = () => {
		const { loading, loadError, success, redirect } = this.state;

		if (redirect) {
			return <Redirect to="/" />;
		} else if (loading) {
			return <LoadingMessage />;
		} else if (loadError) {
			return <ErrorMessage error={loadError} />;
		} else if (success) {
			return (
				<SuccessMessage
					primaryMessage={'Success!'}
					secondaryMessage={'You may now sign in with your new password'}
				/>
			);
		}

		return <PasswordResetForm
			resetId={this.props.match.params.id}
			successHandler={this.handleSuccess}
		/>;
	}
}

export default withRedirectIfLoggedIn(PasswordResetPage);