class DateService {
	formatDateForDisplay(dateStr) {
		const date = new Date(dateStr),
			ten = i => {
				return (i < 10 ? '0' : '') + i;
			},
			YYYY = date.getFullYear(),
			MM = ten(date.getMonth() + 1),
			DD = ten(date.getDate()),
			HH = ten(date.getHours()),
			II = ten(date.getMinutes());

		return `${DD}/${MM}/${YYYY} ${HH}:${II}`;
	}

	convertDateToInputString(date, inputType) {
		const ten = i => {
			return (i < 10 ? '0' : '') + i;
		};
		const YYYY = date.getFullYear(),
			MM = ten(date.getMonth() + 1),
			DD = ten(date.getDate()),
			HH = ten(date.getHours()),
			II = ten(date.getMinutes());

		switch (inputType) {
			case 'date':
				return `${YYYY}-${MM}-${DD}`;

			case 'datetime-local':
				return `${YYYY}-${MM}-${DD}T${HH}:${II}`;

			default:
				return '???';
		}
	}
}

const dateService = new DateService();

export default dateService;