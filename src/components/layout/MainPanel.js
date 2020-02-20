import React, { Component } from 'react';
import './MainPanel.css';

class MainPanel extends Component {
	constructor(props) {
		super(props);
		this.defaults = {
			showTitle: false,
			title: 'ESTA Project',
			paddingClassName: 'padding-4'
		};
	}

	render() {
		const { props, defaults } = this,
			{ children, extraClassNames } = props;

		const showTitle = props.showTitle !== undefined ? props.showTitle : defaults.showTitle,
			title = props.title !== undefined ? props.title : defaults.title,
			paddingClassName = props.paddingClassName !== undefined ? props.paddingClassName : defaults.paddingClassName;

		let sectionClassName = 'main-panel';
		sectionClassName += ` ${paddingClassName}`;
		if (extraClassNames) {
			sectionClassName += ` ${extraClassNames.join(' ')}`;
		}
		
		return (
			<div className={sectionClassName}>
				{showTitle && (
					<div className="title-text">
						<h1>{title || this.defaultTitle}</h1>
					</div>
				)}
				{children}
			</div>
		);
	}
}

export default MainPanel;