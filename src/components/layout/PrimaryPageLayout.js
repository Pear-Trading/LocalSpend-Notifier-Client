import React, { Component } from 'react';
import MainPanel from './MainPanel';
import './PrimaryPageLayout.css';

class PrimaryPageLayout extends Component {
	constructor(props) {
		super(props);
		this.showPreMainPanel = false;
		this.specificPageClassName = null;
		this.mainPanelOptions = {};
	}

	render() {
		let sectionClassName = 'primary-page-layout d-flex flex-centre-xy flex-fill';
		if (this.specificPageClassName) {
			sectionClassName += ` ${this.specificPageClassName}`;
		}

		return (
			<section className={sectionClassName}>
				<div>
					{this.showPreMainPanel && this.renderPreMainPanel()}
					{this.renderMainPanel()}
				</div>
			</section>
		);
	}

	renderPreMainPanel = () => {
		return (
			<div className="text-center mx-auto pre-main-panel">
				{this.renderPreMainPanelContents()}
			</div>
		);
	}

	renderPreMainPanelContents = () => {
		return null;
	}

	renderMainPanel() {
		const { showTitle, title, paddingClassName, extraClassNames } = this.mainPanelOptions;
		return (
			<MainPanel
				showTitle={showTitle}
				title={title}
				paddingClassName={paddingClassName}
				extraClassNames={extraClassNames}
			>
				{this.renderMainPanelContents()}
			</MainPanel>
		);
	}

	renderMainPanelContents = () => {
		return null;
	}
}

export default PrimaryPageLayout;