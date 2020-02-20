import React from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import RegisterForm from './RegisterForm';
import withRedirectIfLoggedIn from '../higherOrder/withRedirectIfLoggedIn';
import withAnimations from '../higherOrder/withAnimations';

class RegisterPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'register-page';
		this.mainPanelOptions = {
			showTitle: true
		};
		this.state = {
			submitStatus: 'none'
		};
	}

	handleSubmitSuccess = () => {
		this.setState({ submitStatus: 'success' });
	}

	renderMainPanel = () => {
		this.mainPanelOptions.showTitle = this.state.submitStatus !== 'success';
		return super.renderMainPanel();
	}

	renderMainPanelContents = () => {
		switch (this.state.submitStatus) {
			case 'success':
				return (
					<div className="text-center spaced-children-2">
						<div>
							<h1>{'Registration complete!'}</h1>
						</div>
						<div>
							<h4>{'Your account is now awaiting approval'}</h4>
						</div>
					</div>
				);

			case 'none':
			default:
				return <RegisterForm submitSuccessHandler={this.handleSubmitSuccess} />;
		}
	}
}

export default compose(withRedirectIfLoggedIn, withAnimations)(RegisterPage);