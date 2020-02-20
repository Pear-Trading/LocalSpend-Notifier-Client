import React from 'react';

const OfferTableDeactivateAllCell = ({ clickHandler }) => {
	return (
		<th>
			<span
				className="interactive"
				onClick={clickHandler}
			>{'Deactivate all'}</span>
		</th>
	);
}

export default OfferTableDeactivateAllCell;