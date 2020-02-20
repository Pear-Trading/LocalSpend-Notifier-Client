import React from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import PrimaryButton from '../buttons/PrimaryButton';
import apiService from '../../scripts/ApiService';
import notificationService from '../../scripts/NotificationService';
import FormErrorMessage from '../messages/FormErrorMessage';
import errorService from '../../scripts/ErrorService';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';

class ManageNotificationsPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'manage-notifications-page';
		this.mainPanelOptions = {
			showTitle: true,
			title: 'Offer Notifications'
		};
		this.swRegistration = null;
		this.state = {
			loading: true,
			status: null,
			error: null
		};
		this.pushIsSupported = false;
		this.currentlySubscribed = false;
	}

	componentDidMount() {
		this.registerServiceWorker();
	}

	renderMainPanelContents = () => {
		return (
			<div className="text-center spaced-children-1">
				{this.renderButton()}
				{this.renderError()}
			</div>
		);
	}

	renderButton = () => {
		const { loading, status } = this.state;
		let text, disabled;

		if (loading) {
			text = 'Loading...';
			disabled = true;
		} else if (status !== 'unsupported' && Notification && Notification.permission === 'denied') {
			text = 'Notifications blocked';
			disabled = true;
		} else {
			switch (status) {
				case 'unsupported':
					text = 'Sorry, push notifications are not supported by your browser';
					disabled = true;
					break;

				case 'subscribed':
					text = 'Click to disable notifications';
					disabled = false;
					break;

				case 'notSubscribed':
					text = 'Click to enable notifications';
					disabled = false;
					break;

				case 'requestingPermissionToSubscribe':
					text = 'Click \'Allow\' to enable notifications'
					disabled = true;
					break;

				case 'subscribing':
					text = 'Subscribing...';
					disabled = true;
					break;

				case 'unsubscribing':
					text = 'Unsubscribing...';
					disabled = true;
					break;

				default:
					text = 'This is a button';
					disabled = true;
			}
		}

		return (
			<PrimaryButton
				text={text}
				clickHandler={this.handleToggleNotifs}
				disabled={disabled}
			/>
		);
	}

	renderError = () => {
		return <FormErrorMessage
			error={this.state.error}
			hideIfNoError={true}
			noItalics={true}
			noFormGroup={true}
		/>;
	}

	handleToggleNotifs = () => {
		if (this.currentlySubscribed) {
			this.unsubscribeUser();
		} else {
			this.requestPermissionToSubscribe();
		}
	}

	registerServiceWorker = () => {
		const serviceWorkersSupported = 'serviceWorker' in navigator,
			pushManagerSupported = 'PushManager' in window;

		if (serviceWorkersSupported) {
			console.log('Service workers are supported');
		} else {
			console.warn('Service workers are not supported');
		}
		if (pushManagerSupported) {
			console.log('Push manager API is supported');
		} else {
			console.warn('Push manager API is not supported');
		}

		if (serviceWorkersSupported && pushManagerSupported) {
			this.pushIsSupported = true;
			navigator.serviceWorker.register(notificationService.swUrl)
				.then(swRegistration => {
					console.log('Service worker successfully registered:', swRegistration);
					this.swRegistration = swRegistration;
					this.checkForSubscription();
				})
				.catch(error => {
					errorService.handleError(error, 'Unable to register service worker -', {
						component: this,
						setFalseFieldName: 'loading',
						setErrorFieldName: 'error'
					});
				});
		} else {
			console.warn('Aborting due to lack of support for push notifications');
			this.pushIsSupported = false;
			this.setState({
				loading: false,
				status: 'unsupported'
			});
		}
	}

	checkForSubscription = async () => {
		let currentlySubscribed;

		try {
			const browserSubscription = await this.swRegistration.pushManager.getSubscription();
			if (browserSubscription != null) {
				const responseData = await apiService.checkSubscription({
					subscription: browserSubscription
				});
				currentlySubscribed = responseData.subscribed;
			} else {
				currentlySubscribed = false;
			}
		} catch (error) {
			errorService.handleError(error, 'Error checking for subscription -', {
				component: this,
				setErrorFieldName: 'error'
			});
			currentlySubscribed = false;
		}

		if (currentlySubscribed) {
			console.log('User IS subscribed');
		} else {
			console.log('User is NOT subscribed');
		}

		this.currentlySubscribed = currentlySubscribed;
		this.setState({
			loading: false,
			status: currentlySubscribed ? 'subscribed' : 'notSubscribed'
		});
	}

	requestPermissionToSubscribe = () => {
		this.setState({ status: 'requestingPermissionToSubscribe' });
		return new Promise((resolve, reject) => {
			const permissionResult = Notification.requestPermission(result => {
				resolve(result);
			});
			if (permissionResult) {
				permissionResult.then(resolve, reject);
			}
		})
			.then(permissionResult => {
				if (permissionResult === 'granted') {
					this.subscribeUser();
				} else {
					throw Error('Permission not granted');
				}
			})
			.catch(error => {
				errorService.handleError(error, 'Error getting permission to subscribe -', {
					component: this,
					setErrorFieldName: 'error',
					setCustomField: {
						fieldName: 'status',
						value: 'notSubscribed'
					}
				});
			});
	}

	subscribeUser = async () => {
		this.setState({ status: 'subscribing' });
		const appServerKey = this.urlB64ToUint8Array(notificationService.appServerPublicKey),
			subscribeOptions = {
				userVisibleOnly: true,
				applicationServerKey: appServerKey
			};

		try {
			const subscription = await this.swRegistration.pushManager.subscribe(subscribeOptions);
			if (!subscription) {
				throw Error('Failed to subscribe browser');
			}

			const serverUpdateSuccess = await this.updateSubscriptionOnServer(subscription);
			if (!serverUpdateSuccess) {
				throw Error('Failed to subscribe on server');
			}

			console.log('User is now subscribed');
			this.currentlySubscribed = true;
			this.setState({ status: 'subscribed' });
		} catch (error) {
			errorService.handleError(error, 'Error subscribing -', {
				component: this,
				setErrorFieldName: 'error',
				setCustomField: {
					fieldName: 'status',
					value: 'notSubscribed'
				}
			});
		}
	}

	urlB64ToUint8Array = (base64String) => {
		const padding = '='.repeat((4 - base64String.length % 4) % 4),
			base64 = (base64String + padding)
				.replace(/-/g, '+')
				.replace(/_/g, '/');

		const rawData = window.atob(base64),
			outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; i++) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	unsubscribeUser = async () => {
		this.setState({ status: 'unsubscribing '});

		try {
			const subscription = await this.swRegistration.pushManager.getSubscription();

			if (subscription != null) {
				const browserSuccess = await subscription.unsubscribe();
				if (!browserSuccess) {
					throw Error('Failed to unsubscribe browser');
				}

				const serverSuccess = await this.updateSubscriptionOnServer(subscription, true);
				if (!serverSuccess) {
					console.error('Failed to unsubscribe on server');
				}
			}

			console.log('User is now unsubscribed');
			this.currentlySubscribed = false;
			this.setState({ status: 'notSubscribed' });
		} catch (error) {
			errorService.handleError(error, 'Error unsubscribing -', {
				component: this,
				setErrorFieldName: 'error',
				setCustomField: {
					fieldName: 'status',
					value: 'subscribed'
				}
			});
		}
	}

	updateSubscriptionOnServer = async (subscription, unsubscribe = false) => {
		console.log('Updating subscription on server:', subscription);
		let fetchBody;

		if (unsubscribe) {
			fetchBody = {
				unsubscribe: true,
				subscription: {
					endpoint: subscription.endpoint
				}
			};
		} else {
			fetchBody = {
				unsubscribe: false,
				subscription
			};
		}

		try {
			await apiService.manageSubscription(fetchBody);
			return true;
		} catch (error) {
			errorService.handleError(error, 'Error submitting subscription to server -', {
				component: this,
				setErrorFieldName: 'error'
			});
			return false;
		}
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(ManageNotificationsPage);