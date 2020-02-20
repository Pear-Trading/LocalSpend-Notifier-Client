import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PostOfferPage from './components/offers/PostOfferPage';
import LandingPage from './components/landing/LandingPage';
import LogInPage from './components/login/LogInPage';
import LoggedInLandingPage from './components/landing/LoggedInLandingPage';
import ManageNotificationsPage from './components/notifications/ManageNotificationsPage';
import PrivateRoute from './components/routing/PrivateRoute';
import NavBar from './components/layout/NavBar';
import ServeOfferPage from './components/offers/ServeOfferPage';
import RedeemOfferPage from './components/offers/RedeemOfferPage';
import ProfilePage from './components/profile/ProfilePage';
import DevPage from './components/dev/DevPage';
import RouteNotFoundPage from './components/routing/RouteNotFoundPage';
import RegisterPage from './components/registration/RegisterPage';
import AdminPage from './components/admin/AdminPage';
import AccountSettingsPage from './components/account/AccountSettingsPage';
import ForgotPasswordPage from './components/forgotPassword/ForgotPasswordPage';
import PasswordResetPage from './components/forgotPassword/PasswordResetPage';
import errorService from './scripts/ErrorService';
import authService from './scripts/AuthService';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			redirecting: false/*,
			loggedIn: false,
			user: null*/
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
	}

	/*checkIfLoggedIn = async () => {
		try {
			await authService.checkIfLoggedIn();
		} catch (error) {
			errorService.handleError(error, 'Error checking if signed in -');
		}
	}

	handleLogIn = async (email, password) => {
		this.setState({
			loggedIn: true,
			user: responseData.user
		});
	}

	handleLogOut = async () => {
		this.setState({
			loggedIn: false,
			user: {}
		});
	}

	handleUserNameChanged = (newName) => {
		this.setState({
			user: {
				...this.state.user,
				name: newName
			}
		});
	}*/

	render() {
		const { loading } = this.state;

		if (loading) {
			return null;
			/*return (
				<div className="full-height flex flex-centre-xy">
					<h1>{'Loading...'}</h1>
				</div>
			);*/
		}

		return (
			<Router>
				<Route
					path="/"
					render={props => (
						<NavBar
							{...props}
							redirectTimerStartHandler={() => this.setState({ redirecting: true })}
							redirectTimerEndHandler={() => this.setState({ redirecting: false })}
						/>
					)}
				/>

				<Switch>
					<Route
						path="/"
						exact
						component={LandingPage}
					/>
					<Route
						path="/signin/"
						component={LogInPage}
					/>
					<Route
						path="/forgotPassword/"
						component={ForgotPasswordPage}
					/>
					<Route
						path="/passwordReset/:id/"
						component={PasswordResetPage}
					/>
					<Route
						path="/register/"
						component={RegisterPage}
					/>
					<PrivateRoute
						path="/start/"
						component={LoggedInLandingPage}
					/>
					<PrivateRoute
						path="/profile/"
						component={ProfilePage}
					/>
					<PrivateRoute
						path="/settings/"
						component={AccountSettingsPage}
					/>
					<PrivateRoute
						path="/notifications/"
						render={props => (
							<ManageNotificationsPage
								{...props}
								redirecting={this.state.redirecting}
							/>
						)}
					/>
					<PrivateRoute
						path="/offer/"
						render={props => (
							<PostOfferPage
								{...props}
								redirecting={this.state.redirecting}
							/>
						)}
					/>
					<PrivateRoute
						path="/serveOffer/:id/"
						component={ServeOfferPage}
					/>
					<PrivateRoute
						path="/redeemOffer/:id/"
						component={RedeemOfferPage}
					/>
					<PrivateRoute
						path="/admin/"
						component={AdminPage}
					/>
					<PrivateRoute
						path="/dev/"
						component={DevPage}
					/>
					<Route component={RouteNotFoundPage} />
				</Switch>
			</Router>
		);
	}
}

export default App;