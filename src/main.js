import GoogleSheetService from './GoogleSheetService';

(async function main () {

	try {
		const googleSheet = new GoogleSheetService();

		const response = await googleSheet.get();
		console.log(response);

		await googleSheet.appendRaw(["K","Comedy", "2000", "15"]);

		const response = await googleSheet.get();
		console.log(response);

		await googleSheet.append({
			title: 'L',
			category: undefined,
			year: '2013',
			something_with_space: 15
		});

		const response = await googleSheet.get();
		console.log(response);
	}
	catch (error) {
		console.log(error.stack)
	}

})();
