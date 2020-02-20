import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import ProfilePanel from './ProfilePanel';
import ProfileModeSelector from './ProfileModeSelector';
import ProfileAdvancedModeContainer from './ProfileAdvancedModeContainer';
import ProfileSummaryModeContainer from './ProfileSummaryModeContainer';
import authService from '../../scripts/AuthService';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';
import './ProfilePage.css';

class ProfilePage extends Component {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'profile-page';
		this.state = {
			mode: 'summary',
			data: {}
		};
	}

	handleModeChanged = (newValue) => {
		this.setState({ mode: newValue });
	}

	handleContainerLoadedData = (data, dataAccessorString) => {
		console.log('handleContainerLoadedData', data, dataAccessorString);
		this.setState({
			data: {
				...this.state.data,
				[dataAccessorString]: data
			}
		});
	}

	render() {
		let containerClassName = this.specificPageClassName;

		switch (this.state.mode) {
			case 'summary':
				containerClassName += ' summary-mode';
				break;
			case 'advanced':
				containerClassName += ' advanced-mode';
				break;
			default:
				break;
		}

		return (
			<div className={containerClassName}>
				{this.renderContents()}
			</div>
		);
	}

	renderContents = () => {
		const { mode } = this.state,
			{ user } = authService;

		return (
			<Fragment>
				<ProfilePanel extraClassNames={['profile-header']}>
					<div className="text-center">
						<div className="profile-for-text">
							{'Profile for'}
						</div>
						<div className="username-text">
							{user.name}
						</div>
					</div>
				</ProfilePanel>
				<ProfilePanel>
					<ProfileModeSelector
						currentMode={mode}
						buttonClickHandler={this.handleModeChanged}
					/>
				</ProfilePanel>
				{this.renderDataPanels()}
			</Fragment>
		);
	}

	renderDataPanels = () => {
		const { mode, data } = this.state;
		console.log('renderDataPanels', data);
		switch (mode) {
			case 'summary':
				return <ProfileSummaryModeContainer
					data={data.summary}
					dataLoadedHandler={this.handleContainerLoadedData}
				/>;
			case 'advanced':
				return <ProfileAdvancedModeContainer />;
			default:
				return null;
		}
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(ProfilePage);