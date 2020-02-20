import React, { Component } from 'react';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';
import LoadingMessage from '../messages/LoadingMessage';
import ErrorMessage from '../messages/ErrorMessage';
import './ProfileTable.css';

class ProfileTableContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: !props.data,
			error: null
		};
	}

	componentDidMount() {
		const { mountedHandler, data } = this.props;
		console.log('componentDidMount', data);
		if (!data) {
			mountedHandler();
			this.loadData();
		}
	}

	componentDidUpdate() {
		if (this.props.data && this.state.loading) {
			this.setState({ loading: false });
		}
	}

	handleRefresh = () => {
		this.setState({ loading: true });
		this.loadData();
	}

	loadData = async () => {
		const { apiProfileEndpoint, responseDataAccessor } = this.dataLoadingInfo;
		try {
			const responseData = await apiService.getProfileTableData(apiProfileEndpoint);
			console.log('loadData:', responseData);
			this.props.dataLoadedHandler(responseDataAccessor(responseData), this.props.componentName);
		} catch (error) {
			errorService.handleError(error, 'Error loading table data -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'error'
			});
		}
	}

	render() {
		return (
			<div className="profile-table-container text-center">
				<div className="section-title">
					{this.title}
				</div>
				{this.renderOptions()}
				{this.renderMainBody()}
			</div>
		);
	}

	renderOptions = () => {
		return null;
	}

	renderMainBody = () => {
		const { loading, error } = this.state,
			{ data } = this.props;
		let body;

		function dataIsEmpty(data) {
			if (!data) return true;
			return Array.isArray(data) && !data.length;
		}
		const noData = dataIsEmpty(data);

		if (loading || error || noData) {
			let textContent;

			if (loading) {
				textContent = <LoadingMessage size="h2" />;
			} else if (error) {
				textContent = (
					<ErrorMessage
						error={error}
						primarySize="h2"
						hideSecondary={true}
					/>
				);
			} else if (noData) {
				textContent = <h2>{'No data!'}</h2>;
			} else {
				textContent = <h2>{'?????'}</h2>;
			}

			body = (
				<div>{textContent}</div>
			);
		} else {
			body = (
				<div className="table-wrapper d-flex flex-centre-x">
					{this.renderTable()}
				</div>
			);
		}

		return body;
	}

	renderTable = () => {
		return null;
	}
}

export default ProfileTableContainer;