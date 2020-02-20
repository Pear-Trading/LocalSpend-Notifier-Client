import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginRedirectPage from '../routing/LoginRedirectPage';
import authService from '../../scripts/AuthService';
import errorService from '../../scripts/ErrorService';

const WAIT_TIME = 1500;

function withRedirectIfNotLoggedIn(Component) {
	return class extends Component {
		constructor(props) {
			super(props);
			this.redirectTimer = null;
			this.state = {
				...this.state,
				checkingIfLoggedIn: true,
				redirect: false
			};
		}

		async componentDidMount() {
			try {
				await authService.checkIfLoggedIn();
				this.setState({ checkingIfLoggedIn: false });
			} catch (error) {
				errorService.handleError(error, 'Error checking if signed in -', {
					component: this,
					setFalseFieldName: 'checkingIfLoggedIn'
				});
			}
			if (super.componentDidMount) super.componentDidMount();
		}

		componentWillUnmount() {
			if (this.redirectTimer) {
				clearTimeout(this.redirectTimer);
			}
			if (super.componentWillUnmount) super.componentWillUnmount();
		}

		redirect = () => {
			this.setState({ redirect: true });
		}

		render() {
			const { checkingIfLoggedIn, redirect } = this.state;

			if (checkingIfLoggedIn) {
				return null;
			} else if (!authService.loggedIn) {
				if (!redirect) {
					this.redirectTimer = setTimeout(this.redirect, WAIT_TIME);
					return <LoginRedirectPage />;
				} else {
					return (
						<Redirect to={{
							pathname: "/signin/",
							state: { from: this.props.location }
						}} />
					);
				}
			}

			return super.render();
		}
	};
}

export default withRedirectIfNotLoggedIn;