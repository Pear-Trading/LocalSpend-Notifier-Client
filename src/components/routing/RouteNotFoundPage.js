import React from 'react';
import { Redirect } from 'react-router-dom';
import authService from '../../scripts/AuthService';

const RouteNotFoundPage = (props) => {
	const path = authService.loggedIn ? '/start/' : '/';
	return <Redirect to={path} />;
}

export default RouteNotFoundPage;