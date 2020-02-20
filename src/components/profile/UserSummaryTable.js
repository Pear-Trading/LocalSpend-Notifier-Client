import React from 'react';
import ProfileTableContainer from './ProfileTable';

class UserSummaryTableContainer extends ProfileTableContainer {
	constructor(props) {
		super(props);
		this.title = 'Summary';
		this.dataLoadingInfo = {
			apiProfileEndpoint: '/summary',
			responseDataAccessor: responseData => responseData.summary
		};
	}

	renderTable = () => {
		const { data } = this.props,
			tableData = [
				{
					name: 'Name',
					accessor: data => data.name
				}, {
					name: 'Email',
					accessor: data => data.email
				}, {
					name: 'Total Active Offers',
					accessor: data => data.totalActiveOffers
				}, {
					name: 'Total Transactions',
					accessor: data => data.totalTransactions
				}, {
					name: 'Total Points',
					accessor: data => data.totalPoints
				}
			];
		console.log('renderTable', data);

		return (
			<table>
				<tbody>
					{tableData.map((dataEntry, i) => (
						<tr key={i}>
							<td>{dataEntry.name}</td>
							<td>{dataEntry.accessor(data)}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	}
}

export default UserSummaryTableContainer;