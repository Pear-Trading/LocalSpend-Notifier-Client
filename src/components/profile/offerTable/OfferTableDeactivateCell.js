import React from 'react';

const OfferTableDeactivateCell = ({ status, deactivateClickHandler, confirmClickHandler }) => {
	const renderCellContents = () => {
		let text;
		switch (status) {
			case 'confirm': text = 'Confirm'; break;
			case 'deactivating': text = 'Deactivating...'; break;
			case 'deactivated': text = 'Deactivated'; break;
			case 'failed': text = 'Failed!'; break;
			default: text = 'Deactivate'; break;
		}
		return <span
			className="interactive"
			onClick={handleClick}
		>{text}</span>;
	}

	const handleClick = () => {
		if (status === 'none') {
			deactivateClickHandler();
		} else if (status === 'confirm') {
			confirmClickHandler();
		}
	}

	return (
		<td>
			{renderCellContents()}
		</td>
	);
}

export default OfferTableDeactivateCell;