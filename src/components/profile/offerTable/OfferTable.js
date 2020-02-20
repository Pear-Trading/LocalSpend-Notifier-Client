import React from 'react';
import OfferTableRow from './OfferTableRow';
import OfferTableDeactivateAllCell from './OfferTableDeactivateAllCell';
import ProfileTableContainer from '../ProfileTable';
import errorService from '../../../scripts/ErrorService';

class OfferTableContainer extends ProfileTableContainer {
	constructor(props) {
		super(props);
		this.title = 'Your Active Offers';
		this.dataLoadingInfo = {
			apiProfileEndpoint: '/activeOffers',
			responseDataAccessor: responseData => responseData.offers
		};
		this.state = {
			...this.state,
			deactivatingAllOffers: false
		};
	}

	handleDeactivateAllOffers = () => {
		const confirmText = 'Are you sure you want to deactivate all offers?';
		if (window.confirm(confirmText)) {
			this.setState({ deactivatingAllOffers: true });
		}
	}

	handleOfferDeactivated = (id) => {
		try {
			const newOffers = this.props.data,
				index = newOffers.findIndex(offer => offer.id === id);
			if (index < 0) throw Error(`Could not find index for offer with ID ${id}`);
			newOffers.splice(index, 1);
			this.setState({ data: newOffers });
		} catch (error) {
			errorService.handleError(error, 'Error removing deactivated offer -');
		}
	}

	renderTable = () => {
		const { deactivatingAllOffers } = this.state,
			{ data } = this.props;
		return (
			<table className="offer-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Description</th>
						<th>Status</th>
						<th>Starts</th>
						<th>Expires</th>
						<th></th>
						<OfferTableDeactivateAllCell clickHandler={this.handleDeactivateAllOffers} />
					</tr>
				</thead>
				<tbody>
					{data.map(offer => (
						<OfferTableRow
							key={offer.id}
							offer={offer}
							deactivating={deactivatingAllOffers}
							deactivatedHandler={this.handleOfferDeactivated}
						/>
					))}
				</tbody>
			</table>
		);
	}
}

export default OfferTableContainer;