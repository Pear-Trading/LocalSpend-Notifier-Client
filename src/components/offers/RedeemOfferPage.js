import React, { Fragment } from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import OfferInfo from './OfferInfo';
import TransactionForm from './TransactionForm';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';
import ErrorMessage from '../messages/ErrorMessage';
import LoadingMessage from '../messages/LoadingMessage';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';
import './RedeemOfferPage.css';

class RedeemOfferPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'redeem-offer-page';
		this.mainPanelOptions = {
			extraClassNames: ['spaced-children-2', 'text-center']
		};
		this.state = {
			loading: true,
			error: null,
			sellerName: null,
			offer: null,
			customerName: null,
			transactionComplete: false,
			transactionId: null
		};
	}

	async componentDidMount() {
		try {
			const offerInstanceIdForSeller = this.props.match.params.id,
				responseData = await apiService.redeemOffer({
					offerInstanceIdForSeller
				});
			const { sellerName, offer, customerName } = responseData;
			this.setState({
				loading: false,
				sellerName,
				offer,
				customerName
			});
		} catch (error) {
			errorService.handleError(error, 'Error retrieving offer info -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'error'
			});
		}
	}

	handleTransactionCompletion = (transactionId) => {
		this.setState({
			transactionComplete: true,
			transactionId
		});
	}

	renderMainPanelContents = () => {
		const { loading, error, transactionComplete, transactionId } = this.state,
			{ match } = this.props;

		if (loading) {
			return <LoadingMessage />;
		} else if (error) {
			return <ErrorMessage error={error} />;
		} else if (transactionComplete) {
			return (
				<Fragment>
					<div>
						<h1>{'Transaction complete!'}</h1>
					</div>
					<hr />
					<div>
						<h3><em>{`Transaction ID: ${transactionId}`}</em></h3>
					</div>
				</Fragment>
			);
		}

		const { sellerName, offer, customerName } = this.state;

		return (
			<Fragment>
				<OfferInfo sellerName={sellerName} offer={offer} />
				<div>
					<hr />
					<div className="offer-valid-for-text">
						<span>
							{'This voucher is valid for'}
							<strong>{` ${customerName}`}</strong>
						</span>
					</div>
					<hr />
				</div>
				<TransactionForm
					offerInstanceIdForSeller={match.params.id}
					transactionCompletionHandler={this.handleTransactionCompletion}
				/>
			</Fragment>
		);
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(RedeemOfferPage);