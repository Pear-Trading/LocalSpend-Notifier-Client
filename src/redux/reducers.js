import * as constants from './constants';

const initialPageChangeState = {
	pageChanging: false	
};

export const pageChange = (state = initialPageChangeState, action = {}) => {
	switch (action.type) {
		case constants.PAGE_CHANGE_STARTING:
			return Object.assign({}, state, { pageChanging: true });

		case constants.PAGE_CHANGE_ENDING:
			return Object.assign({}, state, { pageChanging: false });

		default:
			return state;
	}
};