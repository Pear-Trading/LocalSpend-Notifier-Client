import React from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import LogInForm from './LogInForm';
import withRedirectIfLoggedIn from '../higherOrder/withRedirectIfLoggedIn';
import withAnimations from '../higherOrder/withAnimations';

class LogInPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'log-in-page';
		this.mainPanelOptions = {
			showTitle: true
		};
	}

	renderMainPanelContents = () => {
		const from = this.props.location.state
			? this.props.location.state.from
			: { pathname: "/start/" };

		return <LogInForm history={this.props.history} from={from} />;
	}
}

export default compose(withRedirectIfLoggedIn, withAnimations)(LogInPage);