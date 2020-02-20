import React, { Fragment } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import PrimaryButton from '../buttons/PrimaryButton';
import AdminUserTableContainer from './AdminUserTable';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';

class AllUsersTableContainer extends AdminUserTableContainer {
	constructor(props) {
		super(props);
		this.title = 'All Users';
		this.dataRetrievalInfo = {
			apiEndpoint: '/allUsers',
			accessor: data => data.users
		};
		this.state = {
			...this.state,
			editing: false,
			editUser: null
		};
	}

	handleEditUser = (user) => {
		this.setState({
			editing: true,
			editUser: user
		});
	}

	handleModalSubmit = async (values) => {
		try {
			const { editUser, users } = this.state,
				newStatus = values.status;
			if (newStatus !== editUser.status) {
				console.log('status:', `'${editUser.status}' --> '${newStatus}'`)
				await apiService.updateUser({
					userId: editUser.id,
					status: newStatus
				});
				const arrayUser = users.find(user => user.id === editUser.id);
				arrayUser.status = newStatus;
				this.setState({ users });
			}
			this.finishedEditing();
			this.props.reloadHandler(this.constructor.name);
		} catch (error) {
			errorService.handleError(error, 'Error updating user -');
			this.finishedEditing();
		}
	}

	handleModalHidden = () => {
		this.finishedEditing();
	}

	finishedEditing = () => {
		this.setState({
			editing: false,
			editUser: null
		});
	}

	render() {
		return (
			<Fragment>
				{super.render()}
				{this.renderModal()}
			</Fragment>
		);
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
						<th>{'Status'}</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.map(user => {
						const { id, name, email, type, status } = user;
						return (
							<tr key={id}>
								<td className="name-cell">{name}</td>
								<td className="email-cell">{email}</td>
								<td>{type}</td>
								<td className="text-center">{status}</td>
								<td>
									<span
										className="interactive"
										onClick={() => this.handleEditUser(user)}>
									{'Edit'}</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}

	renderModal = () => {
		const show = this.state.editing,
			user = this.state.editUser;
		let content;

		if (show) {
			const { name, email, status } = user;

			content = (
				<Fragment>
					<Modal.Header closeButton>
						<Modal.Title>{user.name}</Modal.Title>
					</Modal.Header>
					<Formik
						initialValues={{
							name,
							email,
							status
						}}
						onSubmit={this.handleModalSubmit}
						render={props => {
							const { values, handleChange, handleSubmit } = props,
								userStatusValues = ['pending', 'active', 'deactivated'],
								firstLetterUpper = (text) => text[0].toUpperCase() + text.slice(1);

							return (
								<Fragment>
									<Modal.Body>
										<Form.Group controlId="name">
											<Form.Label>{'Name'}</Form.Label>
											<Form.Control type="text" value={values.name} disabled />
										</Form.Group>
										<Form.Group controlId="email">
											<Form.Label>{'Email'}</Form.Label>
											<Form.Control type="text" value={values.email} disabled />
										</Form.Group>
										<Form.Group controlId="status">
											<Form.Label>{'Status'}</Form.Label>
											<Form.Control as="select" value={values.status} onChange={handleChange}>
												{userStatusValues.map(status => (
													<option key={status} value={status}>{firstLetterUpper(status)}</option>
												))}
											</Form.Control>
										</Form.Group>
									</Modal.Body>
									<Modal.Footer>
										<PrimaryButton type="submit" text="Submit" clickHandler={handleSubmit} />
									</Modal.Footer>
								</Fragment>
							);
						}}
					/>
				</Fragment>
			);
		} else {
			content = null;
		}

		return (
			<Modal show={show} centered onHide={this.handleModalHidden}>
				{content}
			</Modal>
		);
	}
}

export default AllUsersTableContainer;