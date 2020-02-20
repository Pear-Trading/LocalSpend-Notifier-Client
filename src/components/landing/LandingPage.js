import React from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import PrimaryButton from '../buttons/PrimaryButton';
import withRedirectIfLoggedIn from '../higherOrder/withRedirectIfLoggedIn';
import withAnimations from '../higherOrder/withAnimations';
import withPageChange from '../higherOrder/withPageChange';
import './LandingPage.css';

class LandingPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'landing-page';
		this.mainPanelOptions = {
			showTitle: true
		};
	}

	renderMainPanelContents = () => {
		return (
			<div className="login-register-container">
				<PrimaryButton text="Sign In" clickHandler={() => this.startPageChangeTimer('/signin/')} />
				<span className="inline-middle">or</span>
				<PrimaryButton text="Register" clickHandler={() => this.startPageChangeTimer('/register/')} />
			</div>
		);
	}
}

export default compose(withPageChange, withRedirectIfLoggedIn, withAnimations)(LandingPage);