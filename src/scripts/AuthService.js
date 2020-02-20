import apiService from './ApiService';

class AuthService {
	constructor() {
		this.loggedIn = false;
		this.user = null;
	}

	async logIn(email, password) {
		const responseData = await apiService.logIn({
			email,
			password
		});
		this.loggedIn = true;
		this.user = responseData.user;
	}

	async logOut() {
		await apiService.logOut();
		this.loggedIn = false;
		this.user = null;
	}

	async checkIfLoggedIn() {
		const responseData = await apiService.checkIfLoggedIn();
		if (responseData.loggedIn) {
			this.loggedIn = true;
			this.user = responseData.user;
			return true;
		} else {
			this.loggedIn = false;
			this.user = null;
			return false;
		}
	}

	handleNameChange(newName) {
		this.user.name = newName;
	}
}

const authService = new AuthService();

export default authService;