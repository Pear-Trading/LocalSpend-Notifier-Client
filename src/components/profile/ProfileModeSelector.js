import React, { Fragment } from 'react';
import SelectButton from '../buttons/SelectButton';
import './ProfileModeSelector.css';

const ProfileModeSelector = ({ currentMode, buttonClickHandler }) => {
	const options = [
		{
			value: 'summary',
			text: 'Summary'
		}, {
			value: 'advanced',
			text: 'Advanced'
		}
	];
	const buttons = options.map((option, i) => (
		<SelectButton
			text={option.text}
			selected={currentMode === option.value}
			clickHandler={() => buttonClickHandler(option.value)}
		/>
	));

	return (
		<div className="d-flex flex-centre-x">
			<div className="profile-mode-select">
				{buttons.map((button, i) => {
					let divider;

					if (i > 0) {
						divider = <div className="divider"></div>;
					} else {
						divider = null;
					}

					return (
						<Fragment key={i}>
							{divider}{button}
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}

export default ProfileModeSelector;