import { google } from 'googleapis';

export default class GoogleSheetApi {

	constructor() {
		this.sheets = google.sheets('v4');
		/*
		* Available OAuth scopes:
		*
		* 	https://www.googleapis.com/auth/drive
		* 	https://www.googleapis.com/auth/drive.readonly
		* 	https://www.googleapis.com/auth/drive.file
		* 	https://www.googleapis.com/auth/spreadsheets
		* 	https://www.googleapis.com/auth/spreadsheets.readonly
		*/
		this.scopes = ['https://www.googleapis.com/auth/spreadsheets'];
		this.key = this.getKeys();
		this.authClient = this.authorize();

		// Also possible:
		// if(new.target === GoogleSheetApie) {
		if(new.target.name === 'GoogleSheetApi') {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
	}

	getKeys() {
		try {
			const keys = {
				type: process.env.GOOGLE_API_TYPE,
				project_id: process.env.GOOGLE_API_PROJECT_ID,
				private_key_id: process.env.GOOGLE_API_PRIVATE_KEY_ID,
				// https://github.com/googleapis/google-api-nodejs-client/issues/1110
				private_key: process.env.GOOGLE_API_PRIVATE_KEY.replace(new RegExp('\\\\n', '\g'), '\n'),
				client_email: process.env.GOOGLE_API_CLIENT_EMAIL,
				client_id: process.env.GOOGLE_API_CLIENT_ID,
				auth_uri: process.env.GOOGLE_API_AUTH_URI,
				token_uri: process.env.GOOGLE_API_TOKEN_URI,
				auth_provider_x509_cert_url: process.env.GOOGLE_API_AUTH_PROVIDER_X509_CERT_URL,
				client_x509_cert_url: process.env.GOOGLE_API_CLIENT_X509_CERT_URL,
			}
			// You could also store the object and parse it before using: https://www.npmjs.com/package/google-auth-library#json-web-tokens

			return keys;
		}
		catch (error) {
			throw new Error('Could not load Keys');
		}
	}

	authorize() {
		return new google.auth.JWT(this.key.client_email, undefined, this.key.private_key, this.scopes);
	}

	async get() {
		try {
			const response = await this.sheets.spreadsheets.values.get(this.getRequestParameters);
			return response.data.values;
		}
		catch (error) {
			console.log(error)
		}
	}

	async append(newRow) {
		const request = this.appendRequestParameters;
		request['resource'] = {"values": [newRow]};

		try {
			const response = await this.sheets.spreadsheets.values.append(request);
			return response.data;
		}
		catch (error) {
			console.log(error)
		}
	}
}
