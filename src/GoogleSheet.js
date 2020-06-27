import GoogleSheetApiService from './GoogleSheetApiService';

export default class GoogleSheet extends GoogleSheetApiService {
	constructor() {
		super();
		this.getRequestParameters = {
			spreadsheetId: process.env.MY_SPREADSHEET_ID,
			range: process.env.MY_SPREADSHEET_TAB,
			majorDimension: 'ROWS',
			auth: this.authClient,
		};
		this.appendRequestParameters = {
			spreadsheetId: process.env.MY_SPREADSHEET_ID,
			range: process.env.MY_SPREADSHEET_TAB,
			auth: this.authClient,
			valueInputOption: 'RAW',
			insertDataOption: 'INSERT_ROWS',
		};
		this.titleLine = 0; // Usually the first row is the titles
		this.skipTopRows = 1; // Gonna Skip the top n rows (in this case, the title)
	}

	async getRaw() {
		return super.get();
	}

	async get() {
		const rawList = await super.get();

		const parsedList = [];

		for (let rowIndex = this.skipTopRows; rowIndex < rawList.length; rowIndex++) {

			let item = {};
			/*
			* If your GoogleSheet doenst have A title row,
			* you are going to need to edit this method
			*/
			for (let columnIndex = 0; columnIndex < rawList[this.titleLine].length; columnIndex++) {
				const cell = rawList[rowIndex][columnIndex];

				// Replace "spaces" with "_" and transform all to "Lowercase"
				const cleanTitle = (rawList[this.titleLine][columnIndex]).replace(/ /g,"_").toLowerCase();
				item[cleanTitle] = cell || undefined;
			}
			parsedList.push(item);
		}

		return parsedList;
	}

	async appendRaw(newRawRow) {
		return super.append(newRawRow);
	}

	async append(jsonObject) {
		const newRow = [];

		for (let key in jsonObject) {
			newRow.push(jsonObject[key]);
		}

		return super.append(newRow);
	}
}
