import React from 'react';

const FormErrorMessage = ({ error, hideIfNoError = false, noItalics = false, noFormGroup = false }) => {
	let className = 'form-error text-center text-danger';

	if (!noItalics) className += ' font-italic';
	if (!noFormGroup) className += ' form-group';
	if (!error) className += hideIfNoError ? ' d-none' : ' invisible';

	let displayError;
	if (typeof error === 'object' && error !== null) {
		const { primary, secondary } = error;
		displayError = primary;
		if (secondary) displayError += `. ${secondary}`;
	} else {
		displayError = error;
	}

	return <div className={className}>{displayError || 'No error'}</div>;
}

export default FormErrorMessage;