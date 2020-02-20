import React from 'react';

const ProfilePanel = ({ children, scrollX = false, extraClassNames }) => {
	let className = 'main-panel profile-panel padding-2';
	if (scrollX) {
		className += ' scroll-x';
	}
	if (extraClassNames && extraClassNames.length) {
		className += ` ${extraClassNames.join(' ')}`;
	}
	return (
		<section className={className}>
			{children}
		</section>
	);
}

export default ProfilePanel;