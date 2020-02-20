import React, { Fragment } from 'react';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';

class LoginRedirectPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'login-redirect-page';
		this.mainPanelOptions = {
			extraClassNames: ['spaced-children-1', 'text-center']
		};
	}

	renderMainPanelContents = () => {
		return (
			<Fragment>
				<div className="text-danger">
					<h2>You need to be logged in to view this content</h2>
				</div>
				<div>
					<h4><em>Redirecting...</em></h4>
				</div>
			</Fragment>
		);
	}
}

export default LoginRedirectPage;