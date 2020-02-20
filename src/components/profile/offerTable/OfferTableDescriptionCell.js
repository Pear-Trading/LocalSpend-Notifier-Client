import React, { Component } from 'react';
import './OfferTableDescriptionCell.css';

class OfferTableDescriptionCell extends Component {
	render() {
		return (
			<td className="description-cell">
				{this.renderCellContents()}
			</td>
		);
	}

	renderCellContents = () => {
		const { description, mode, inputChangeHandler } = this.props;
		if (mode === 'edit') {
			return (
				<input
					type="text"
					className="description-input"
					defaultValue={description}
					onChange={inputChangeHandler}
				/>
			);
		} else {
			return (
				<span>{description}</span>
			);
		}
	}
}

export default OfferTableDescriptionCell;