import React, { Component, Fragment } from 'react';
import ProfilePanel from './ProfilePanel';
import ProfileAdvancedDataSelector from './ProfileAdvancedDataSelector';
import ProfileAdvancedChart from './ProfileAdvancedChart';
import apiService from '../../scripts/ApiService';
import errorService from '../../scripts/ErrorService';

class ProfileAdvancedModeContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			loading: false,
			error: false,
			chartData: null
		};
	}

	handleFormSubmit = async (values) => {
		values.forNumTimeUnits = parseInt(values.forNumTimeUnits);
		console.log('Form values:', values);
		this.setState({
			submitted: true,
			loading: true,
			error: false
		});
		try {
			const responseData = await apiService.getAdvancedChartData({
				formValues: values
			});
			console.log('Response chart data:', responseData.chartData);
			this.setState({
				loading: false,
				chartData: responseData.chartData
			});
		} catch (error) {
			errorService.handleError(error, 'Error retrieving chart data -', {
				component: this,
				setFalseFieldName: 'loading',
				setErrorFieldName: 'error'
			});
		}
	}

	render() {
		const { submitted, loading, error, chartData } = this.state;
		return (
			<Fragment>
				<ProfilePanel>
					<ProfileAdvancedDataSelector
						submitHandler={this.handleFormSubmit}
					/>
				</ProfilePanel>
				<ProfilePanel>
					<ProfileAdvancedChart
						submitted={submitted}
						loading={loading}
						error={error}
						data={chartData}
					/>
				</ProfilePanel>
			</Fragment>
		);
	}
}

export default ProfileAdvancedModeContainer;