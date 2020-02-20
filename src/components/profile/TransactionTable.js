import React from 'react';
import ProfileTableContainer from './ProfileTable';

class TransactionTableContainer extends ProfileTableContainer {
	constructor(props) {
		super(props);
		this.title = 'Your Recent Transactions';
		this.dataLoadingInfo = {
			apiProfileEndpoint: '/recentTransactions',
			responseDataAccessor: responseData => responseData.transactions
		};
		this.initialNumVisibleTransactions = 10;
		this.state = {
			...this.state,
			numVisibleTransactions: this.initialNumVisibleTransactions,
			allTransactionsVisible: false
		};
	}

	handleShowMoreTransactions = () => {
		let { numVisibleTransactions } = this.state;
		numVisibleTransactions += this.initialNumVisibleTransactions;
		this.setState({ numVisibleTransactions });
	}

	handleShowAllTransactions = () => {
		this.setState({ allTransactionsVisible: true });
	}

	handleResetTable = () => {
		this.setState({
			numVisibleTransactions: this.initialNumVisibleTransactions,
			allTransactionsVisible: false
		});
	}

	renderTable = () => {
		const { data } = this.props;
		return (
			<div className="transaction-table-container">
				<div>
					<table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Seller</th>
								<th>Customer</th>
								<th>Offer description</th>
								<th>Value</th>
								<th>Points</th>
								<th>Timestamp</th>
							</tr>
						</thead>
						<tbody>
							{data.map((transaction, i) => {
								const { numVisibleTransactions, allTransactionsVisible } = this.state;
								if (!allTransactionsVisible && i >= numVisibleTransactions) {
									return null;
								}
								const { id,
									sellerName,
									customerName,
									offerDescription,
									transactionValue,
									pointsAwarded,
									dateTime } = transaction;
								return (
									<tr key={id}>
										<td>{id}</td>
										<td>{sellerName}</td>
										<td>{customerName}</td>
										<td>{offerDescription ? offerDescription : 'N/A'}</td>
										<td>{transactionValue}</td>
										<td>{pointsAwarded}</td>
										<td>{dateTime}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div className="line-height-300 font-weight-bold">
					<span
						className="interactive inline-start"
						onClick={this.handleShowMoreTransactions}
					>
						{'Show More Transactions'}
					</span>
					<span className="inline-middle">
						{' - '}
					</span>
					<span
						className="interactive inline-middle"
						onClick={this.handleShowAllTransactions}
					>
						{'Show All Transactions'}
					</span>
					<span className="inline-middle">
						{' - '}
					</span>
					<span
						className="interactive inline-end"
						onClick={this.handleResetTable}
					>
						{' Reset Table '}
					</span>
				</div>
			</div>
		);
	}
}

export default TransactionTableContainer;