import React from 'react';

const TimeIntervalSelector = ({
		timeUnits,
		formValues,
		locked,
		selectEnabled,
		changeHandler,
		checkboxClickHandler,
		selectRefCreationHandler
	}) => {
	const selectedTimeUnitIndex = timeUnits.findIndex(unit => unit.toLowerCase() === formValues.timeUnit),
		validTimeUnits = timeUnits.filter((unit, i) => i > selectedTimeUnitIndex);

	let timeIntervalOptions;
	if (locked) {
		timeIntervalOptions = (
			<option
				key={-1}
				value=""
			>{'Unavailable'}</option>
		);
	} else {
		timeIntervalOptions = validTimeUnits.map(unit => (
			<option
				key={unit}
				value={unit.toLowerCase()}
			>{`Every ${unit}`}</option>
		));
	}

	return (
		<div className="d-flex flex-centre-xy">
			<input
				type="checkbox"
				id="timeIntervalChecked"
				className="inline-left"
				value="checked"
				checked={!locked && selectEnabled}
				disabled={locked}
				onChange={event => {
					changeHandler(event);
					checkboxClickHandler(event);
				}}
			/>
			<select
				id="timeInterval"
				className="inline-right"
				value={formValues.timeInterval}
				disabled={locked || !selectEnabled}
				onChange={changeHandler}
				ref={selectRefCreationHandler}
			>
				{timeIntervalOptions}
			</select>
		</div>
	);
}

export default TimeIntervalSelector;