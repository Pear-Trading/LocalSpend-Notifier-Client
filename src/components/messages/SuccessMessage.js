import React from 'react';

const SuccessMessage = ({ primaryMessage, secondaryMessage }) => {
	return (
		<div className="text-center">
			<h1>{primaryMessage || 'Success!'}</h1>
			<h5>{secondaryMessage}</h5>
		</div>
	);
}

export default SuccessMessage;