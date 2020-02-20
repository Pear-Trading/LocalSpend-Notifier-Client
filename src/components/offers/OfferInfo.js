import React from 'react';
import './OfferInfo.css';

const OfferInfo = ({ sellerName, offer }) => {
	return (
		<div className="offer-info spaced-children-2 text-center">
			<div>
				<div className="courtesy-of-text">
					{'Offer courtesy of'}
				</div>
				<div className="seller-name-text">
					{sellerName}
				</div>
			</div>
			<div className="offer-details">
				<div className="offer-description-text">
					{offer.description}
				</div>
				<div className="offer-expires-text">
					{`Valid Until: ${offer.validUntil}`}
				</div>
			</div>
		</div>
	);
}

export default OfferInfo;