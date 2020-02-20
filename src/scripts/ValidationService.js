import * as config from '../config';

class ValidationService {
	/*validateUserName(value) {
		const { maxLength } = config.users.name;
		if (value.length > maxLength) {
			return `Name must be a maximum of ${maxLength} characters`;
		}
		return null;
	}*/

	validateEmailAddress(value) {
		return this.isValidEmailAddress(value) ? null : 'Invalid email address';
	}

	isValidEmailAddress(value) {
		return value.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/) != null;
	}

	validatePostcode(value) {
		return this.isValidPostcode(value) ? null : 'Invalid postcode';
	}

	isValidPostcode(value) {
		return value.match(/^[a-zA-Z0-9]{2,4}(\s)?[a-zA-Z0-9]{3}$/) != null;
	}

	validatePassword(value) {
		const { minLength, maxLength } = config.users.password;
		if (value.length < minLength || value.length > maxLength) {
			return `Password must be between ${minLength} and ${maxLength} characters`;
		}
		return null;
	}

	validateDealValue(value) {
		const containsPercent = value.includes('%'),
			containsPound = value.includes('£'),
			containsPence = value.match(/p/i) != null,
			diffSymbolCount = containsPercent + containsPound + containsPence;
		
		if (diffSymbolCount === 0) {
			return 'Must contain \'%\', \'£\' or \'p\'';
		} else if (diffSymbolCount > 1) {
			return 'Invalid input';
		} else if (containsPercent) {
			const percentValue = parseInt(value);
			if (!value.match(/^[0-9]{1,3}%$/)
					|| percentValue < 1 || percentValue > 100) {
				return 'Invalid percent';
			}
		} else if ((containsPound && !this.isValidPoundsString(value))
				|| (containsPence && !this.isValidPenceString(value))) {
			return 'Invalid value';
		}

		return null;
	}

	isValidPoundsString(value) {
		return value.match(/^£[0-9]+(.[0-9]{2})?$/) != null;
	}

	isValidPenceString(value) {
		return value.match(/^[0-9]{1,2}p$/i) != null;
	}

	validateOfferValidityDates(validFrom, validUntil, validFromCustomEnabled) {
		let errors = {};
		const validFromTimestamp = (new Date(validFrom)).getTime(),
			validUntilTimestamp = (new Date(validUntil)).getTime(),
			currentTimestamp = Date.now();

		if (validFromCustomEnabled && validFromTimestamp <= currentTimestamp) {
			errors.validFrom = 'Must be at a point in the future';
		}

		if (validUntilTimestamp <= currentTimestamp) {
			errors.validUntil = 'Must be at a point in the future';
		} else if (validFromCustomEnabled && validUntilTimestamp <= validFromTimestamp) {
			errors.validUntil = 'Must occur after \'Valid from\' date';
		}

		return errors;
	}

	validateOfferNumberOfUses(numUses) {
		if (typeof numUses !== 'number') {
			return 'Must be a number';
		} else if (numUses < 0) {
			return 'Must not be negative';
		}
		return null;
	}

	validateTransactionValue(value) {
		const containsPound = value.includes('£'),
			containsPence = value.match(/p/i) != null,
			diffSymbolCount = containsPound + containsPence;
		
		if (diffSymbolCount === 0) {
			return 'Must contain \'£\' or \'p\'';
		} else if (diffSymbolCount > 1) {
			return 'Invalid input';
		} else if ((containsPound && !this.isValidPoundsString(value))
				|| (containsPence && !this.isValidPenceString(value))) {
			return 'Invalid value';
		}

		return null;
	}
}

const validationService = new ValidationService();

export default validationService;