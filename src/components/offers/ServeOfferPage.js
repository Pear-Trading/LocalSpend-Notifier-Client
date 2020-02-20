import React, { Fragment } from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import OfferInfo from './OfferInfo';
import apiService from '../../scripts/ApiService';
import ErrorMessage from '../messages/ErrorMessage';
import errorService from '../../scripts/ErrorService';
import LoadingMessage from '../messages/LoadingMessage';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import PrimaryButton from '../buttons/PrimaryButton';
import FormErrorMessage from '../messages/FormErrorMessage';
import withAnimations from '../higherOrder/withAnimations';
import './ServeOfferPage.css';
import loadingSpinner from '../../images/loading-spinner.svg';

class ServeOfferPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'serve-offer-page';
		this.mainPanelOptions = {
			extraClassNames: ['spaced-children-1', 'text-center']
		};
		this.offerInstanceIdForCustomer = this.props.match.params.id;
		this.activateTimer = null;
		this.state = {
			loading: true,
			loadError: null,
			sellerName: null,
			offer: null,
			activating: false,
			activated: false,
			activationError: null,
			codeUrl: null,
			imageLoaded: false
		};
	}

	async componentDidMount() {
		try {
			const { offerInstanceIdForCustomer } = this,
				responseData = await apiService.serveOffer({
					offerInstanceIdForCustomer
				});
			console.log('Response data', responseData);
			const { sellerName, offer, activated, codeUrl } = responseData;
			this.setState({
				loading: false,
				sellerName,
				offer,
				activated,
				codeUrl: codeUrl || null
			});
		} catch (error) {
			errorService.handleError(error, 'Error retrieving offer info -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'loadError'
			});
		}
	}

	componentWillUnmount() {
		if (this.activateTimer) {
			clearTimeout(this.activateTimer);
		}
	}

	handleActivateOffer = async () => {
		this.setState({ activating: true });
		await new Promise(resolve => {
			this.activateTimer = setTimeout(resolve, 2500);
		});
		try {
			const { offerInstanceIdForCustomer } = this,
				responseData = await apiService.customerActivateOffer({
					offerInstanceIdForCustomer
				});
			console.log('codeUrl', responseData.codeUrl);
			this.setState({
				activating: false,
				activated: true,
				codeUrl: responseData.codeUrl
			});
		} catch (error) {
			errorService.handleError(error, 'Error activating offer -', {
				component: this,
				setFalseFieldName: 'activating',
				setErrorFieldName: 'activationError'
			});
		}
	}

	handleLoadedQrCode = (event) => {
		this.setState({ imageLoaded: true });
	}

	renderMainPanelContents = () => {
		const { loading, loadError } = this.state;

		if (loading) {
			return <LoadingMessage />;
		} else if (loadError) {
			return <ErrorMessage error={loadError} />;
		}

		const { imageLoaded, sellerName, offer, activated, activating, activationError, codeUrl } = this.state;

		return (
			<Fragment>
				<OfferInfo sellerName={sellerName} offer={offer} />
				{activated
					? (
						<div>
							<div className="qr-code-help-text">
								{'Have the seller scan the following QR code to proceed'}
							</div>
							<hr />
							<div className="qr-code-wrapper d-flex flex-centre-x">
								{imageLoaded
									? <img src={codeUrl} className="qr-code" alt="QR Code" />
									: (
										<Fragment>
											<div className="qr-code">
												<img
													src={loadingSpinner}
													className="qr-code"
													alt="Loading..."
												/>
											</div>
											<div className="d-none">
												<img
													src={codeUrl}
													alt="WHY ARE YOU READING THIS"
													onLoad={this.handleLoadedQrCode}
												/>
											</div>
										</Fragment>
									)
								}
							</div>
							<hr />
						</div>
					) : (
						<Fragment>
							<hr />
							<div>
								<div>
									<h4>{'Do you wish to pay 20p to activate this offer?'}</h4>
								</div>
								<div className="activate-button-wrapper">
									<PrimaryButton
										text={activating ? 'Activating...' : 'Pay & Activate'}
										clickHandler={this.handleActivateOffer}
										disabled={activating}
									/>
								</div>
								<FormErrorMessage
									error={activationError}
									hideIfNoError={true}
									noItalics={true}
									noFormGroup={true}
								/>
							</div>
						</Fragment>
					)
				}
			</Fragment>
		);
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(ServeOfferPage);