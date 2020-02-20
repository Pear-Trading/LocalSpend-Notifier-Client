import React from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import AccountSettingsForm from './AccountSettingsForm';
import SuccessMessage from '../messages/SuccessMessage';
import authService from '../../scripts/AuthService';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';

const SUCCESS_WAIT_TIME = 2000;

class AccountSettingsPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'account-settings-page';
		this.mainPanelOptions = {
			showTitle: true,
			title: 'Account Settings'
		};
		this.resetSubmitStatusTimer = null;
		this.state = {
			submitStatus: 'none'
		};
	}

	componentWillUnmount() {
		if (this.resetSubmitStatusTimer) {
			clearTimeout(this.resetSubmitStatusTimer);
		}
	}

	handleSubmitSuccess = (responseData) => {
		if (responseData.name !== authService.user.name) {
			authService.handleNameChange(responseData.name);
		}
		this.setState(
			{ submitStatus: 'success' },
			this.handleSuccessMessageDisplayed
		);
	}

	handleSuccessMessageDisplayed = () => {
		this.resetSubmitStatusTimer = setTimeout(
			() => this.setState({ submitStatus: 'none' }),
			SUCCESS_WAIT_TIME
		);
	}

	renderMainPanel = () => {
		const { state, mainPanelOptions } = this;

		switch (state.submitStatus) {
			case 'success':
				mainPanelOptions.showTitle = false;
				mainPanelOptions.extraClassNames = ['success'];
				break;

			case 'none':
			default:
				mainPanelOptions.showTitle = true;
				mainPanelOptions.extraClassNames = undefined;
		}

		return super.renderMainPanel();
	}

	renderMainPanelContents = () => {
		switch (this.state.submitStatus) {
			case 'success':
				return (
					<SuccessMessage
						secondaryMessage={'Your account settings have been updated'}
					/>
				);

			case 'none':
			default:
				return (
					<AccountSettingsForm
						submitSuccessHandler={this.handleSubmitSuccess}
					/>
				);
		}
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(AccountSettingsPage);