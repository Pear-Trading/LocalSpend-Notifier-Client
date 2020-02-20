import React from 'react';
import apiService from '../../scripts/ApiService';
import AdminUserTableContainer from './AdminUserTable';
import errorService from '../../scripts/ErrorService';

class ApproveUsersTableContainer extends AdminUserTableContainer {
	constructor(props) {
		super(props);
		this.title = 'Users Awaiting Approval';
		this.dataRetrievalInfo = {
			apiEndpoint: '/usersAwaitingApproval',
			accessor: data => data.users
		};
	}

	approveUserWithIndex = async (index) => {
		try {
			const { users } = this.state,
				user = users[index];
			await apiService.approveUser({
				id: user.id
			});
			users.splice(index, 1);
			this.setState({ users });
			this.props.reloadHandler(this.constructor.name);
		} catch (error) {
			errorService.handleError(error, 'Error approving user -');
		}
	}

	renderTable = () => {
		const { users } = this.state;

		return (
			<table>
				<thead>
					<tr>
						<th>{'Name'}</th>
						<th>{'Email'}</th>
						<th>{'Type'}</th>
						<th>{'Approve'}</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, i) => {
						const { id, name, email, type } = user;
						return (
							<tr key={id}>
								<td className="name-cell">{name}</td>
								<td className="email-cell">{email}</td>
								<td>{type}</td>
								<td className="confirm-cell">
									<span
										className="interactive"
										onClick={() => this.approveUserWithIndex(i)
									}>{'Yes'}</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}
}

export default ApproveUsersTableContainer;