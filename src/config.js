export const apiRoot = 'http://localhost:4000/api';
export const notificationSwUrl = 'http://localhost:3000/sw.js';
export const appServerPublicKey = (
	'BLmrjLTK2Y5E5YYNNUsMi7EIvIKJOqTg86rmLGml7ctChP-xD9giEecfLA5GxfBny5DnDfqiNiICb0muVBHUyoA'
);
export const users = {
	name: {
		maxLength: 64
	},
	email: {
		maxLength: 128
	},
	postcode: {
		maxLength: 8
	},
	password: {
		minLength: 4,
		maxLength: 64
	}
};
export const offers = {
	description: {
		maxLength: 200
	},
	dealValue: {
		maxLength: 20
	}
};