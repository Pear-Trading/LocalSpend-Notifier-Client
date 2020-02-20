import React, { Fragment } from 'react';
import { compose } from 'redux';
import OfferForm from './OfferForm';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';
import './PostOfferPage.css';

const SUBMIT_WAIT_TIME = 3000;

class PostOfferPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'post-offer-page';
		this.showPreMainPanel = true;
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

	handleSubmitSuccess = () => {
		this.setState({ submitStatus: 'success' });
		this.setResetSubmitStatusTimer();
	}

	setResetSubmitStatusTimer = () => {
		this.resetSubmitStatusTimer = setTimeout(
			() => this.setState({ submitStatus: 'none' }),
			SUBMIT_WAIT_TIME
		);
	}

	renderPreMainPanelContents = () => {
		switch (this.state.submitStatus) {
			case 'none':
				return (
					<Fragment>
						<div className="enter-offer-text">
							<h2>{'- Enter your offer here -'}</h2>
						</div>
						<div>
							{'Offers created here will be broadcasted to everyone'
							+ ' who has enabled offer notifications on the ESTA site.'}
						</div>
					</Fragment>
				);

			case 'success':
			default:
				return null;
		}
	}

	renderMainPanel = () => {
		const { state, mainPanelOptions } = this;

		switch (state.submitStatus) {
			case 'success':
				mainPanelOptions.paddingClassName = undefined;
				mainPanelOptions.extraClassNames = ['success'];
				break;

			case 'none':
			default:
				mainPanelOptions.paddingClassName = 'padding-2';
				mainPanelOptions.extraClassNames = undefined;
		}
		
		return super.renderMainPanel();
	}

	renderMainPanelContents = () => {
		const { enterAnimationStarted, submitStatus } = this.state;

		switch (submitStatus) {
			case 'success':
				return (
					<div className="d-flex flex-centre-xy">
						<h1>{'Offer successfully posted!'}</h1>
					</div>
				);

			case 'none':
			default:
				return (
					<OfferForm
						animate={enterAnimationStarted}
						submitSuccessHandler={this.handleSubmitSuccess}
					/>
				);
		}
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(PostOfferPage);