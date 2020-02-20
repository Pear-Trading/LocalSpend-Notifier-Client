import React, { Component, Fragment } from 'react';
import UserSummaryTableContainer from './UserSummaryTable';
import OfferTableContainer from './offerTable/OfferTable';
import TransactionTableContainer from './TransactionTable';
import ProfilePanel from './ProfilePanel';

class ProfileSummaryModeContainer extends Component {
	constructor(props) {
		super(props);
		this.containerName = 'summary';
		this.data = {};
		this.numDataComponentsLoadingData = 0;
		this.dataComponents = [
			{
				name: 'userSummaryTable',
				component: UserSummaryTableContainer
			}, {
				name: 'offerTable',
				component: OfferTableContainer,
				scrollX: true
			}, {
				name: 'transactionTable',
				component: TransactionTableContainer,
				scrollX: true
			}
		];
	}

	handleDataComponentMounted = () => {
		this.numDataComponentsLoadingData++;
		console.log('handleDataComponentMounted', this.numDataComponentsLoadingData);
	}

	handleDataComponentLoadedData = (data, dataAccessorString) => {
		console.log('handleDataComponentLoadedData', data, dataAccessorString);
		this.data[dataAccessorString] = data;
		if (--this.numDataComponentsLoadingData === 0) {
			this.props.dataLoadedHandler(this.data, this.containerName);
			console.log('handleDataComponentLoadedData B');
		}
	}

	render() {
		const { data } = this.props;
		console.log('render', data);
		return (
			<Fragment>
				{this.dataComponents.map((dataComponent, i) => {
					const { name, scrollX } = dataComponent;
					return (
						<ProfilePanel key={i} scrollX={scrollX === true}>
							<dataComponent.component
								componentName={name}
								data={data ? data[name] : null}
								mountedHandler={this.handleDataComponentMounted}
								dataLoadedHandler={this.handleDataComponentLoadedData}
							/>
						</ProfilePanel>
					);
				})}
			</Fragment>
		);
	}
}

export default ProfileSummaryModeContainer;