import React from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import authService from '../../scripts/AuthService';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';
import withPageChange from '../higherOrder/withPageChange';
import './LoggedInLandingPage.css';

class LoggedInLandingPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'logged-in-landing-page';
		this.mainPanelOptions = {
			showTitle: true,
			title: 'Welcome'
		};
		this.state = {
			listEnterAnimationComplete: false
		};
	}

	handleListTransitionEnd = () => {
		console.log('handleListTransitionEnd');
		if (!this.state.listEnterAnimationComplete) {
			this.setState({ listEnterAnimationComplete: true });
		}
	}

	renderMainPanel = () => {
		// const { user } = authService;
		// this.mainPanelOptions.title = user.name ? `Welcome, ${user.name}` : 'Welcome';
		return super.renderMainPanel();
	}

	renderMainPanelContents = () => {
		const { user } = authService,
			links = [
				{
					title: 'Profile',
					location: '/profile/',
					moreInfo: 'View your profile data',
					className: 'profile'
				}, {
					title: 'Manage Notifications',
					location: '/notifications/',
					moreInfo: 'Enable or disable offer notifications',
					className: 'notifications'
				}, {
					title: 'Post Offer',
					location: '/offer/',
					moreInfo: 'Post a new offer to the ESTA network',
					className: 'offer'
				}
			];

		if (user) {
			if (user.type.hasAdminPriveleges) {
				links.push({
					title: 'Admin',
					location: '/admin/',
					moreInfo: 'View admin controls'
				});
			}
			if (user.type.hasDevPriveleges) {
				links.push({
					title: 'Dev',
					location: '/dev/',
					moreInfo: 'View developer tools'
				});
			}
		}

		let listClassName = 'links-list large-text';
		const { enterAnimationStarted, listEnterAnimationComplete } = this.state;
		if (listEnterAnimationComplete) {
			listClassName += ' animated';
		} else if (enterAnimationStarted) {
			listClassName += ' animate';
		}
		console.log('listClassName', listClassName);

		return (
			<div>
				<ul className={listClassName} onTransitionEnd={this.handleListTransitionEnd}>
					{links.map(link => {
						const { title, location, moreInfo, className } = link;
						return (
							<li key={location}>
								<div className="title">
									<span
										className="interactive font-weight-bold"
										onClick={() => this.startPageChangeTimer(location)}
									>{title}</span>
								</div>
								<div className="more-info">
									{moreInfo}
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		);
			{/*<div className="button-line-container text-center">
				<Link to="/profile/">
					<PrimaryButton text="Profile" />
				</Link>
				{<Link to="/notifications/">
					<PrimaryButton text="Manage Notifications" />
				</Link>}
				<PrimaryButton
					text="Manage Notifications"
					clickHandler={() => this.startRedirectTimer('/notifications/')}
				/>
				<Link to="/offer/">
					<PrimaryButton text="Post Offer" />
				</Link>
				{user.type.hasAdminPriveleges && (
					<Link to="/admin/">
						<PrimaryButton text="Admin" />
					</Link>
				)}
				{user.type.hasDevPriveleges && (
					<Link to="/dev/">
						<PrimaryButton text="Dev" />
					</Link>
				)}
			</div>*/}
	}
}

export default compose(withPageChange, withRedirectIfNotLoggedIn, withAnimations)(LoggedInLandingPage);