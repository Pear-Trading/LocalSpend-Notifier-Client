import * as config from '../config';

class NotificationService {
	constructor() {
		this.swUrl = config.notificationSwUrl;
		this.appServerPublicKey = config.appServerPublicKey;
	}
}

const notificationService = new NotificationService();

export default notificationService;