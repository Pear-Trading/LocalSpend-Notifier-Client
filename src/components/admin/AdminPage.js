import React, { Fragment } from 'react';
import { compose } from 'redux';
import PrimaryPageLayout from '../layout/PrimaryPageLayout';
import ApproveUsersTableContainer from './ApproveUsersTable';
import AllUsersTableContainer from './AllUsersTable';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';
import withAnimations from '../higherOrder/withAnimations';
import './AdminPage.css';

class AdminPage extends PrimaryPageLayout {
	constructor(props) {
		super(props);
		this.specificPageClassName = 'admin-page';
		this.state = {
			...this.state,
			reload: false,
			reloadOriginComponentName: null
		};
	}

	componentDidUpdate() {
		if (this.state.reload) {
			this.setState({
				reload: false,
				reloadOriginComponentName: null
			});
		}
	}

	handleReload = (componentName) => {
		this.setState({
			reload: true,
			reloadOriginComponentName: componentName
		});
	}

	renderMainPanelContents = () => {
		const { reload, reloadOriginComponentName } = this.state;

		const tableComponents = [
			{
				name: 'ApproveUsersTableContainer',
				component: ApproveUsersTableContainer
			}, {
				name: 'AllUsersTableContainer',
				component: AllUsersTableContainer
			}
		];

		let elements = [];
		for (let i = 0; i < tableComponents.length; i++) {
			const { name, component } = tableComponents[i],
				Component = component;
			if (i > 0) elements.push(<hr key={`${name} hr`} />);
			elements.push(
				<Component
					key={name}
					reload={reload && name !== reloadOriginComponentName}
					reloadHandler={this.handleReload}
				/>
			);
		}

		return (
			<Fragment>
				{elements}
			</Fragment>
		);
	}
}

export default compose(withRedirectIfNotLoggedIn, withAnimations)(AdminPage);