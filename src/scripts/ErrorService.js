class ErrorService {
	constructErrorMessageItem(error) {
		if (!error.data || !error.data.errorItem
				|| (!error.data.errorItem.technicalMessage && !error.data.errorItem.clientMessageItem)) {
			const errorItem = this.convertErrorToErrorItem(error);
			return new ErrorMessageItem(errorItem);
		}
		return new ErrorMessageItem(error.data.errorItem);
	}

	handleError(error, errorConsolePrefix, componentOptions) {
		const errorMessageItem = this.constructErrorMessageItem(error);
		console.error(errorConsolePrefix, errorMessageItem.toConsoleString());
		if (componentOptions) {
			const { component, setFalseFieldName, setErrorFieldName, setCustomField } = componentOptions;
			let newState = {};
			if (setFalseFieldName) newState[setFalseFieldName] = false;
			if (setErrorFieldName) newState[setErrorFieldName] = errorMessageItem.clientMessageItem;
			if (setCustomField) {
				const { fieldName, value } = setCustomField;
				newState[fieldName] = value;
			}
			component.setState(newState);
		}
	}

	convertErrorToErrorItem(error) {
		const { type, message } = error;
		return {
			id: type,
			technicalMessage: message,
			clientMessageItem: this.convertToClientMessageItem(message)
		};
	}

	convertToClientMessageItem(message) {
		return {
			primary: this.convertToClientMessage(message)
		};
	}

	convertToClientMessage(message) {
		switch (message) {
			case 'Failed to fetch':
				return 'Sorry, the server could not be reached';

			default:
				return message;
		}
	}
}

class ErrorMessageItem {
	constructor(errorItem) {
		const { id, technicalMessage, clientMessageItem } = errorItem;
		this.id = id;
		this.technicalMessage = technicalMessage;
		this.clientMessageItem = clientMessageItem;
	}

	toConsoleString() {
		const { id, technicalMessage, clientMessageItem } = this;
		if (id && technicalMessage) {
			return `${id}: ${technicalMessage}`;
		} else if (id && clientMessageItem) {
			return `${id}: ${clientMessageItem.primary}`;
		}
		return technicalMessage;
	}
}

const errorService = new ErrorService();

export default errorService;