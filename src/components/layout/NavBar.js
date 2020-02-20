import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import CornerButton from '../buttons/CornerButton';
import errorService from '../../scripts/ErrorService';
import authService from '../../scripts/AuthService';
import withPageChange from '../higherOrder/withPageChange';
import './NavBar.css';

class NavBar extends Component {
	handleOpenAccountSettings = () => {
		this.startPageChangeTimer('/settings/');
	}

	handleLogOut = async () => {
		try {
			this.startPageChangeTimer('/', undefined, true);
		} catch (error) {
			errorService.handleError(error, 'Error signing out -');
		}
	}

	handleChangeUser = async () => {
		try {
			this.startPageChangeTimer('/signin/', { from: this.props.location }, true);
		} catch (error) {
			errorService.handleError(error, 'Error signing out -');
		}
	}

	render() {
		const { pathname } = this.props.location,
			{ loggedIn, user } = authService;

		const pathStartsWith = searchStrings => {
			for (let searchStr of searchStrings) {
				if (pathname.startsWith(searchStr)) {
					return true;
				}
			}
			return false;
		};

		let cornerButtons = [];
		const showHomeButton = pathname !== '/' && !pathStartsWith(['/start']),
			showUserNameDropdown = loggedIn;

		if (showHomeButton) {
			const path = loggedIn ? '/start/' : '/';
			cornerButtons.push({
				text: 'Home',
				clickHandler: () => this.startPageChangeTimer(path)
			});
		}

		return (
			<nav className="my-navbar d-flex">
				{(cornerButtons.length > 0 || showUserNameDropdown) && (
					<span className="corner-buttons-container margin-left-auto d-flex flex-centre-y">
						{cornerButtons.map((button, i) => {
							const { link, path, text, clickHandler } = button;
							if (link) {
								return (
									<Link key={i} to={path}>
										<CornerButton text={text} />
									</Link>
								);
							}
							return (
								<CornerButton
									key={i}
									text={text}
									clickHandler={clickHandler}
								/>
							);
						})}
						{showUserNameDropdown && (
							<DropdownButton title={`Signed in as ${user.name}`} className="corner-button">
								<Dropdown.Item onClick={this.handleOpenAccountSettings}>{'Account settings'}</Dropdown.Item>
								<Dropdown.Item onClick={this.handleChangeUser}>{'Change user'}</Dropdown.Item>
								<Dropdown.Item onClick={this.handleLogOut}>{'Sign out'}</Dropdown.Item>
							</DropdownButton>
						)}
					</span>
				)}
			</nav>
		);
	}
}

export default withPageChange(NavBar);