import React, { Component } from 'react';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';
import LoadingMessage from '../messages/LoadingMessage';
import ErrorMessage from '../messages/ErrorMessage';

class AdminUserTableContainer extends Component {
	constructor(props) {
		super(props);
		this.title = 'Title';
		this.dataRetrievalInfo = {};
		this.state = {
			loading: true,
			error: null,
			users: []
		};
	}

	async componentDidMount() {
		try {
			const { apiEndpoint, accessor } = this.dataRetrievalInfo;
			const responseData = await apiService.getAdminTableData(apiEndpoint);
			this.setState({
				loading: false,
				users: accessor(responseData)
			});
		} catch (error) {
			errorService.handleError(error, 'Error retrieving table data -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'error'
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.reload && !prevProps.reload) {
			this.componentDidMount();
		}
	}

	render() {
		return (
			<div>
				<div className="text-center">
					<h1>{this.title}</h1>
				</div>
				{this.renderMainBody()}
			</div>
		);
	}

	renderMainBody = () => {
		const { loading, error, users } = this.state;
		let body;

		if (loading || error || !users.length) {
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
			} else if (!users.length) {
				textContent = <h2>{'No users!'}</h2>;
			} else {
				textContent = <h2>{'?????'}</h2>;
			}

			body = (
				<div className="text-center">
					{textContent}
				</div>
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

export default AdminUserTableContainer;