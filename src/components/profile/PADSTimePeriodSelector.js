import React, { Fragment } from 'react';

const TimePeriodSelector = ({
		timeUnitOptions,
		formValues,
		dateInputType,
		timePeriodMode,
		changeHandler,
		timePeriodModeRadioButtonClickHandler
	}) => {

	let forTextSpanClassName = 'inline-middle interactive for-text';
	if (timePeriodMode === 'for') forTextSpanClassName += ' selected-tp-mode-text';
	let betweenTextSpanClassName = 'inline-middle interactive between-text';
	if (timePeriodMode === 'between') betweenTextSpanClassName += ' selected-tp-mode-text';

	let forStartElementId, forStartElement, betweenStartElement, betweenEndElementId, betweenEndElement;
	switch (dateInputType) {
		case 'datetime-local':
			forStartElementId = 'forStartDateTime';
			forStartElement = (
				<input
					id={forStartElementId}
					className="inline-right"
					type="datetime-local"
					value={formValues.forStartDateTime}
					onChange={changeHandler}
				/>
			);
			betweenStartElement = (
				<input
					id="betweenStartDateTime"
					className="inline-middle"
					type="datetime-local"
					value={formValues.betweenStartDateTime}
					onChange={changeHandler}
				/>
			);
			betweenEndElementId = 'betweenEndDateTime';
			betweenEndElement = (
				<input
					id={betweenEndElementId}
					className="inline-right"
					type="datetime-local"
					value={formValues.betweenEndDateTime}
					onChange={changeHandler}
				/>
			);
			break;

		case 'date':
		default:
			forStartElementId = 'forStartDate';
			forStartElement = (
				<input
					id={forStartElementId}
					className="inline-right"
					type="date"
					value={formValues.forStartDate}
					onChange={changeHandler}
				/>
			);
			betweenStartElement = (
				<input
					id="betweenStartDate"
					className="inline-middle"
					type="date"
					value={formValues.betweenStartDate}
					onChange={changeHandler}
				/>
			);
			betweenEndElementId = 'betweenEndDate';
			betweenEndElement = (
				<input
					id={betweenEndElementId}
					className="inline-right"
					type="date"
					value={formValues.betweenEndDate}
					onChange={changeHandler}
				/>
			);
	}

	return (
		<Fragment>
			<div className="d-flex flex-centre-xy">
				<input
					type="radio"
					id="timePeriodModeFor"
					name="timePeriodMode"
					value="for"
					checked={timePeriodMode === 'for'}
					onChange={event => {
						changeHandler(event);
						timePeriodModeRadioButtonClickHandler(event);
					}}
				/>
				<label
					className={forTextSpanClassName}
					htmlFor="timePeriodModeFor"
				>
					{'For'}
				</label>
				<input
					type="text"
					id="forNumTimeUnits"
					className="inline-middle number-input"
					value={formValues.forNumTimeUnits}
					onChange={changeHandler}
				/>
				<select
					id="forTimeUnit"
					className="inline-middle"
					value={formValues.forTimeUnit}
					onChange={changeHandler}
				>
					{timeUnitOptions}
				</select>
				<label
					className="inline-middle"
					htmlFor={forStartElementId}
				>
					{'starting'}
				</label>
				{forStartElement}
			</div>
			<div className="or-text">{'OR'}</div>
			<div className="d-flex flex-centre-xy">
				<input
					type="radio"
					id="timePeriodModeBetween"
					name="timePeriodMode"
					value="between"
					checked={timePeriodMode === 'between'}
					onChange={event => {
						changeHandler(event);
						timePeriodModeRadioButtonClickHandler(event);
					}}
				/>
				<label
					className={betweenTextSpanClassName}
					htmlFor="timePeriodModeBetween"
				>
					{'Between'}
				</label>
				{betweenStartElement}
				<label
					className="inline-middle"
					htmlFor={betweenEndElementId}
				>
					{'and'}
				</label>
				{betweenEndElement}
			</div>
		</Fragment>
	);
}

export default TimePeriodSelector;