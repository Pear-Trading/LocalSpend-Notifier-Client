import React from 'react';

const ErrorMessage = ({ error, primarySize = "h3", hideSecondary = false, secondarySize = "h4" }) => {
	const { primary, secondary } = error,
		PrimaryTag = primarySize,
		primaryTextContent = <PrimaryTag className="text-danger">{primary}</PrimaryTag>;

	if (!secondary || hideSecondary) {
		return <div className="text-center">{primaryTextContent}</div>;
	}

	const SecondaryTag = secondarySize,
		secondaryTextContent = <SecondaryTag>{secondary}</SecondaryTag>;
	return (
		<div className="spaced-children-1 text-center">
			{primaryTextContent}
			{secondaryTextContent}
		</div>
	);
}

export default ErrorMessage;