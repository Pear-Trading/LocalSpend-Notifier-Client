import React from 'react';
import { Redirect } from 'react-router-dom';
import authService from '../../scripts/AuthService';
import errorService from '../../scripts/ErrorService';

function withRedirectIfLoggedIn(Component) {
	return class extends Component {
		constructor(props) {
			super(props);
			this.doneRedirect = false;
			this.state = {
				...this.state,
				loading: true
			};
		}

		async componentDidMount() {
			try {
				await authService.checkIfLoggedIn();
				this.setState({ loading: false });
			} catch (error) {
				errorService.handleError(error, 'Error checking if signed in -', {
					component: this,
					setFalseFieldName: 'loading'
				});
			}
			if (super.componentDidMount) super.componentDidMount();
		}

		render() {
			if (this.state.loading) {
				return null;
			}

			if (!this.doneRedirect) {
				this.doneRedirect = true;
				if (authService.loggedIn) {
					return <Redirect to="/start/" />;
				}
			}
			
			return super.render();
		}
	};
}

export default withRedirectIfLoggedIn;