import React, { Component } from 'react';
import OfferTableDeactivateCell from './OfferTableDeactivateCell';
import OfferTableEditCell from './OfferTableEditCell';
import OfferTableDescriptionCell from './OfferTableDescriptionCell';
import apiService from '../../../scripts/ApiService';
import errorService from '../../../scripts/ErrorService';

const RESET_WAIT_TIME = 2000;

class OfferTableRow extends Component {
	constructor(props) {
		super(props);
		this.processingDeactivation = false;
		this.resetEditStatusTimer = null;
		this.resetDeactivationStatusTimer = null;
		const { description } = props.offer;
		this.descriptionInput = description;
		this.state = {
			editStatus: 'none',
			deactivationStatus: 'none',
			mode: 'default',
			description
		};
	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.deactivating && !this.processingDeactivation) {
			this.handleDeactivate();
		}
		return true;
	}

	componentWillUnmount() {
		if (this.resetEditStatusTimer) {
			clearTimeout(this.resetEditStatusTimer);
		}
		if (this.resetDeactivationStatusTimer) {
			clearTimeout(this.resetDeactivationStatusTimer);
		}
	}

	handleEdit = () => {
		this.setState({ mode: 'edit' });
	}

	handleDescriptionInputChange = (event) => {
		this.descriptionInput = event.target.value;
	}

	handleSave = async () => {
		if (this.descriptionInput !== this.state.description) {
			const success = await this.updateDescription(this.descriptionInput);
			if (success) {
				this.setState({
					mode: 'default',
					description: this.descriptionInput
				});
			}
		} else {
			this.setState({ mode: 'default' });
		}
	}

	async updateDescription(newDescription) {
		this.setState({ editStatus: 'saving' });
		try {
			await apiService.updateOffer({
				offer: {
					id: this.props.offer.id,
					description: newDescription
				}
			});
			this.setState({ editStatus: 'none' });
			return true;
		} catch (error) {
			errorService.handleError(error, 'Error updating offer -');
			this.setState(
				{ editStatus: 'failed' },
				this.setResetEditStatusTimer
			);
			return false;
		}
	}

	handleStartDeactivation = () => {
		this.setState(
			{ deactivationStatus: 'confirm' },
			this.setResetDeactivationStatusTimer
		);
	}

	handleDeactivate = async () => {
		this.processingDeactivation = true;
		clearTimeout(this.resetDeactivationStatusTimer);
		this.setState({ deactivationStatus: 'deactivating' });
		try {
			const { offer, deactivatedHandler } = this.props;
			await apiService.deactivateOffer({
				offerId: offer.id
			});
			this.setState({ deactivationStatus: 'deactivated' });
			deactivatedHandler(offer.id);
		} catch (error) {
			errorService.handleError(error, 'Error deactivating offer -');
			this.setState(
				{ deactivationStatus: 'failed' },
				this.setResetDeactivationStatusTimer
			);
		}
		this.processingDeactivation = false;
	}

	setResetEditStatusTimer = () => {
		this.resetEditStatusTimer = setTimeout(
			() => this.setState({ editStatus: 'none' }),
			RESET_WAIT_TIME
		);
	}

	setResetDeactivationStatusTimer = () => {
		this.resetDeactivationStatusTimer = setTimeout(
			() => {
				const { deactivationStatus } = this.state;
				if (deactivationStatus === 'confirm' || deactivationStatus === 'failed') {
					this.setState({ deactivationStatus: 'none' })
				}
			},
			RESET_WAIT_TIME
		);
	}

	render() {
		const { offer } = this.props,
			{ id, status, starts, expires } = offer,
			{ editStatus, deactivationStatus, mode, description } = this.state;
		return (
			<tr>
				<td>{id}</td>
				<OfferTableDescriptionCell
					description={description}
					mode={mode}
					inputChangeHandler={this.handleDescriptionInputChange}
				/>
				<td className="text-capitalize">{status}</td>
				<td>{starts}</td>
				<td>{expires}</td>
				<OfferTableEditCell
					status={editStatus}
					mode={mode}
					editClickHandler={() => this.handleEdit()}
					saveClickHandler={() => this.handleSave()}
				/>
				<OfferTableDeactivateCell
					status={deactivationStatus}
					mode={mode}
					deactivateClickHandler={() => this.handleStartDeactivation()}
					confirmClickHandler={() => this.handleDeactivate()}
				/>
			</tr>
		);
	}
}

export default OfferTableRow;