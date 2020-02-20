import React from 'react';

const LoadingMessage = ({ size = "h2" }) => {
	const Tag = size;
	return (
		<div className="text-center">
			<Tag>{'Loading...'}</Tag>
		</div>
	);
}

export default LoadingMessage;