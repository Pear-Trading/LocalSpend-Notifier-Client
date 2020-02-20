import React from 'react';

const OfferTableEditCell = ({ status, mode, editClickHandler, saveClickHandler }) => {
	const renderCellContents = () => {
		let text;

		if (mode === 'edit') {
			switch (status) {
				case 'saving': text = 'Saving...'; break;
				case 'saved': text = 'Saved'; break;
				case 'failed': text = 'Failed!'; break;
				default: text = 'Save'; break;
			}
		} else {
			text = 'Edit';
		}

		return <span
			className="interactive"
			onClick={handleClick}
		>{text}</span>;
	}

	const handleClick = () => {
		if (status === 'none') {
			mode === 'edit' ? saveClickHandler() : editClickHandler();
		}
	}

	return (
		<td className="edit-cell">
			{renderCellContents()}
		</td>
	);
}

export default OfferTableEditCell;