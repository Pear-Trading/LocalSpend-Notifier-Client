import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import TimeIntervalSelector from './PADSTimeIntervalSelector';
import TimePeriodSelector from './PADSTimePeriodSelector';
import PrimaryButton from '../buttons/PrimaryButton';
import dateService from '../../scripts/DateService';

class ProfileAdvancedDataSelector extends Component {
	constructor(props) {
		super(props);

		const now = new Date();
		this.nowDateString = dateService.convertDateToInputString(now, 'date');
		this.nowDatetimeLocalString = dateService.convertDateToInputString(now, 'datetime-local');

		this.timeIntervalSelectRef = undefined;
		this.newTimeIntervalSelectValue = undefined;

		this.state = {
			dateInputType: 'date',
			timePeriodMode: 'for',
			timeIntervalEnabled: false,
			timeIntervalLocked: false
		};
	}

	handleTimeIntervalSelectRefCreated = (ref) => {
		this.timeIntervalSelectRef = ref;
	}

	handleTimeUnitChanged = (event) => {
		const newValue = event.target.value,
			newDateInputType = newValue === 'hour' ? 'datetime-local' : 'date',
			newTimeIntervalLocked = newValue === 'year';
		this.setState({
			dateInputType: newDateInputType,
			timeIntervalLocked: newTimeIntervalLocked
		}, this.triggerTimeIntervalSelectChange);
	}

	/* need to check new time interval select value manually after time unit updates
	 * as new, smaller set of time intervals may be available
	 * making current selection invalid
	 * but change event does not automatically trigger
	 * note this is referring to the value held by formik, NOT the value that is displayed */
	triggerTimeIntervalSelectChange = () => {
		if (this.timeIntervalSelectRef) {
			const newValue = this.timeIntervalSelectRef.value;
			if (newValue) {
				this.newTimeIntervalSelectValue = newValue;
			}
		}
	}

	handleTimePeriodModeRadioButtonClicked = (event) => {
		this.setState({ timePeriodMode: event.target.value });
	}

	handleTimeIntervalCheckboxClicked = (event) => {
		this.setState({ timeIntervalEnabled: event.target.checked });
	}

	render() {
		const { submitHandler } = this.props;

		const timeUnits = ['Hour', 'Day', 'Week', 'Month', 'Year'],
			timeUnitOptions = timeUnits.map((unit, i) => (
				<option key={i} value={unit.toLowerCase()}>{`${unit}s`}</option>
			));

		return (
			<div className="options-container text-center">
				<Formik
					initialValues={{
						timeUnit: 'day',
						timePeriodMode: 'for',
						forNumTimeUnits: '1',
						forTimeUnit: 'week',
						forStartDateTime: this.nowDatetimeLocalString,
						forStartDate: this.nowDateString,
						betweenStartDateTime: this.nowDatetimeLocalString,
						betweenEndDateTime: this.nowDatetimeLocalString,
						betweenStartDate: this.nowDateString,
						betweenEndDate: this.nowDateString,
						timeIntervalChecked: [],
						timeInterval: 'week'
					}}
					onSubmit={submitHandler}
					render={props => {
						const {
							dateInputType,
							timePeriodMode,
							timeIntervalEnabled,
							timeIntervalLocked
						} = this.state;
						const { values, handleChange, handleSubmit } = props;

						// 1337 hax0r at work
						if (this.newTimeIntervalSelectValue) {
							values.timeInterval = this.newTimeIntervalSelectValue;
							this.newTimeIntervalSelectValue = null;
						}

						return (
							<Fragment>
								<div className="title-text text-success">
									{'Transactions Chart Options'}
								</div>
								<div>
									<form className="spaced-children-1" onSubmit={handleSubmit}>
										<div className="d-flex flex-centre-x">
											<div className="options">
												<div>
													<label className="inline-left" htmlFor="timeUnit">
														{'Unit of time'}
													</label>
													<select
														id="timeUnit"
														className="inline-right"
														value={values.timeUnit}
														onChange={event => {
															handleChange(event);
															this.handleTimeUnitChanged(event);
														}}
													>
														{timeUnitOptions}
													</select>
												</div>
												<hr />
												<TimePeriodSelector
													timeUnitOptions={timeUnitOptions}
													formValues={values}
													dateInputType={dateInputType}
													timePeriodMode={timePeriodMode}
													changeHandler={handleChange}
													timePeriodModeRadioButtonClickHandler={this.handleTimePeriodModeRadioButtonClicked}
												/>
												<hr />
												<TimeIntervalSelector
													timeUnits={timeUnits}
													formValues={values}
													locked={timeIntervalLocked}
													selectEnabled={timeIntervalEnabled}
													changeHandler={handleChange}
													checkboxClickHandler={this.handleTimeIntervalCheckboxClicked}
													selectRefCreationHandler={this.handleTimeIntervalSelectRefCreated}
												/>
											</div>
										</div>
										<div>
											<PrimaryButton
												type="submit"
												text="Go!"
												colourClassName="btn-success"
											/>
										</div>
									</form>
								</div>
							</Fragment>
						);
					}}
				/>
			</div>
		);
	}
}

export default ProfileAdvancedDataSelector;