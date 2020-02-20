import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import PrimaryButton from '../buttons/PrimaryButton';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';
import './DevPage.css';

class DevPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'dev-page';
		this.mainPanelOptions = {
			extraClassNames: ['text-center']
		};
		this.numRandomTransactions = 100;
		this.transactionUserIdRange = {
			start: 6,
			end: 16
		};
		this.state = {
			transactions: []
		};
	}

	componentDidMount() {
		this.generateRandomTransactions();
	}

	generateRandomTransactions = () => {
		const generateRandomUserId = (invalidId) => {
			const { start, end } = this.transactionUserIdRange;
			let randomId;
			do {
				randomId = start + Math.floor(Math.random() * (end - start + 1));
			} while (randomId === invalidId);
			return randomId;
		}

		let newTransactions = [];

		for (let i = 0; i < this.numRandomTransactions; i++) {
			const sellerId = generateRandomUserId(),
				customerId = generateRandomUserId(sellerId),
				value = (1 + Math.floor(Math.random() * 20)) * 5,
				valueStr = `£${value}`,
				date = this.generateRandomDateFromStrings('2019-06-01', '2019-09-01');

			newTransactions.push({
				sellerId,
				customerId,
				value: valueStr,
				date
			});
		}

		this.setState({ transactions: newTransactions });
	}

	generateRandomDateFromStrings = (startDateStr, endDateStr) => {
		const startDate = new Date(startDateStr),
			endDate = new Date(endDateStr),
			startTimestamp = startDate.getTime(),
			endTimestamp = endDate.getTime(),
			randomTimestamp = startTimestamp + Math.floor(Math.random() * (endTimestamp - startTimestamp));
		return new Date(randomTimestamp);
	}

	handleSubmitNewUser = async (values) => {
		try {
			await apiService.addNewUser({
				formValues: values
			});
			console.log('Success!');
		} catch (error) {
			errorService.handleError(error, 'Error adding new user -');
		}
	}

	handleSubmitNewLogin = async (values) => {
		try {
			await apiService.addNewLogin({
				formValues: values
			});
			console.log('Success!!');
		} catch (error) {
			errorService.handleError(error, 'Error adding new login -');
		}
	}

	handleAddTransactions = async (transactions) => {
		try {
			await apiService.addNewTransactions({
				transactions
			});
			console.log('Success!!!');
			// this.generateRandomTransactions();
		} catch (error) {
			errorService.handleError(error, 'Error adding transactions -');
		}
	}

	renderMainPanelContents = () => {
		const { transactions } = this.state;

		return (
			<Fragment>
				<div className="add-data-section">
					<div>
						<h1>{'Add User'}</h1>
					</div>
					<div>
						<Formik
							initialValues={{
								name: '',
								type: ''
							}}
							onSubmit={this.handleSubmitNewUser}
							render={props => {
								const { values, handleSubmit, handleChange } = props;

								return (
									<form onSubmit={handleSubmit}>
										<div className="d-flex flex-centre-xy">
											<input
												type="text"
												id="name"
												className="user-name inline-left"
												value={values.name}
												placeholder="Name"
												onChange={handleChange}
											/>
											<input
												type="text"
												id="type"
												className="inline-middle"
												value={values.type}
												placeholder="Type"
												onChange={handleChange}
											/>
											<PrimaryButton
												type="submit"
												text="Add"
												largeText={false}
												extraClassNames={['inline-right']}
											/>
										</div>
									</form>
								);
							}}
						/>
					</div>
				</div>
				<div className="add-data-section">
					<div>
						<h1>{'Add Login'}</h1>
					</div>
					<div>
						<Formik
							initialValues={{
								userId: '',
								password: ''
							}}
							onSubmit={this.handleSubmitNewLogin}
							render={props => {
								const { values, handleSubmit, handleChange } = props;

								return (
									<form onSubmit={handleSubmit}>
										<div className="d-flex flex-centre-xy">
											<input
												type="text"
												id="userId"
												className="inline-left number-input"
												value={values.userId}
												placeholder="User ID"
												onChange={handleChange}
											/>
											<input
												type="text"
												id="password"
												className="inline-middle"
												value={values.password}
												placeholder="Password"
												onChange={handleChange}
											/>
											<PrimaryButton
												type="submit"
												text="Add"
												largeText={false}
												extraClassNames={['inline-right']}
											/>
										</div>
									</form>
								);
							}}
						/>
					</div>
				</div>
				<div className="add-data-section">
					<div>
						<h1>Add Random Transactions</h1>
					</div>
					<div>
						<table className="transactions-table mx-auto">
							<thead>
								<tr>
									<th>Seller ID</th>
									<th>Customer ID</th>
									<th>Value</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((transaction, i) => (
									<tr key={i}>
										<td>{transaction.sellerId}</td>
										<td>{transaction.customerId}</td>
										<td>{transaction.value}</td>
										<td>{transaction.date.toString()}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div>
						<PrimaryButton
							text="Add Transactions"
							clickHandler={() => this.handleAddTransactions(transactions)}
						/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(DevPage);