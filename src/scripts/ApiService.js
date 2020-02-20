import * as config from '../config';

class ApiService {
	constructor() {
		this.apiBaseUrl = config.apiRoot;
		this.fetchMethods = [
			{
				name: 'GET',
				fetchFunction: this.get,
				sendData: false
			}, {
				name: 'POST',
				fetchFunction: this.post,
				sendData: true
			}, {
				name: 'PUT',
				fetchFunction: this.put,
				sendData: true
			}, {
				name: 'DELETE',
				fetchFunction: this.delete,
				sendData: true
			}
		];
	}

	constructApiUrl(endpoint) {
		return `${this.apiBaseUrl}${endpoint}`;
	}

	async fetchWithoutData(url, method) {
		return fetch(url, {
			method,
			credentials: 'include'
		});
	}

	async get(url) {
		return this.fetchWithoutData(url, 'GET');
	}

	async fetchWithData(url, method, data) {
		return fetch(url, {
			method,
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
	}

	async post(url, data) {
		return this.fetchWithData(url, 'POST', data);
	}

	async put(url, data) {
		return this.fetchWithData(url, 'PUT', data);
	}

	async delete(url, data) {
		return this.fetchWithData(url, 'DELETE', data);
	}

	async sendRequest(endpoint, method, data) {
		const apiFetchMethod = this.determineApiFetchMethod(method),
			apiUrl = this.constructApiUrl(endpoint);
		let response;
		if (apiFetchMethod.sendData) {
			response = await apiFetchMethod.fetchFunction.call(this, apiUrl, data);
		} else {
			response = await apiFetchMethod.fetchFunction.call(this, apiUrl);
		}
		const responseData = response ? await response.json() : null;
		this.checkResponseForError(response, responseData);
		return responseData;
	}

	determineApiFetchMethod(methodName) {
		return this.fetchMethods.find(method => method.name === methodName);
	}

	checkResponseForError(response, responseData) {
		if (responseData && responseData.error) {
			const responseError = responseData.error;
			throw this.createErrorWithData({
				message: `${responseError.id}: ${responseError.message}`,
				data: responseData
			});
		} else if (!response.ok) {
			throw Error('Bad response from server');
		} else if (!responseData || !responseData.success) {
			throw this.createErrorWithData({
				message: 'Bad response data from server',
				data: responseData
			});
		}
	}

	createErrorWithData({ message, data }) {
		let error = new Error(message);
		error.data = data;
		return error;
	}

	async checkIfLoggedIn() {
		return this.sendRequest('/signInCheck', 'GET');
	}

	async logIn(data) {
		return this.sendRequest('/signIn', 'POST', data);
	}

	async logOut() {
		return this.sendRequest('/signOut', 'GET');
	}

	async getPublicAccountTypes() {
		return this.sendRequest('/publicAccountTypes', 'GET');
	}

	async register(data) {
		return this.sendRequest('/register', 'POST', data);
	}

	async addNewUser(data) {
		return this.sendRequest('/dev/newUser', 'POST', data);
	}

	async addNewLogin(data) {
		return this.sendRequest('/dev/newLogin', 'POST', data);
	}

	async addNewTransactions(data) {
		return this.sendRequest('/dev/newTransactions', 'POST', data);
	}

	async checkSubscription(data) {
		return this.sendRequest('/subscriptionCheck', 'POST', data);
	}

	async manageSubscription(data) {
		return this.sendRequest('/manageSubscription', 'POST', data);
	}

	async postOffer(data) {
		return this.sendRequest('/postOffer', 'POST', data);
	}

	async updateOffer(data) {
		return this.sendRequest('/updateOffer', 'PUT', data);
	}

	async deactivateOffer(data) {
		return this.sendRequest('/deactivateOffer', 'PUT', data);
	}

	async completeTransaction(data) {
		return this.sendRequest('/completeTransaction', 'POST', data);
	}

	async redeemOffer(data) {
		return this.sendRequest('/redeemOffer', 'POST', data);
	}

	async serveOffer(data) {
		return this.sendRequest('/serveOffer', 'POST', data);
	}

	async getProfileTableData(profileEndpoint) {
		return this.sendRequest(`/profile${profileEndpoint}`, 'GET');
	}

	async getAdvancedChartData(data) {
		return this.sendRequest('/profile/advancedChart', 'POST', data);
	}

	async getAdminTableData(adminEndpoint) {
		return this.sendRequest(`/admin${adminEndpoint}`, 'GET');
	}

	async approveUser(data) {
		return this.sendRequest('/admin/approveUser', 'PUT', data);
	}

	async updateUser(data) {
		return this.sendRequest('/admin/updateUser', 'PUT', data);
	}

	async getUserAccountDetails() {
		return this.sendRequest('/userAccountDetails', 'GET');
	}

	async updateUserAccountDetails(data) {
		return this.sendRequest('/userAccountDetails', 'PUT', data);
	}

	async forgotPassword(data) {
		return this.sendRequest('/forgotPassword', 'POST', data);
	}

	async checkPasswordResetId(data) {
		return this.sendRequest('/passwordResetId', 'POST', data);
	}

	async updateForgottenPassword(data) {
		return this.sendRequest('/updateForgottenPassword', 'PUT', data);
	}

	async customerActivateOffer(data) {
		return this.sendRequest('/customerActivateOffer', 'POST', data);
	}
}

const apiService = new ApiService();

export default apiService;