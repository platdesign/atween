'use strict';


module.exports = class InterceptorsController {

	constructor() {
		this.store = [];
	}


	register(config) {

		if(typeof config === 'function') {
			config = {
				priority: 1000,
				handler: config
			};
		} else if(config.handler) {
			config.priority = config.priority || 1000;
		} else {
			throw new Error('Invalid interceptor config');
		}

		this.store.push(config);

		this.store.sort((a, b) => {
			return a.priority - b.priority;
		});

	}


	run(input) {

		let lastTransformedInput = input;

		return this.store
			.map((config) => config.handler)
			.reduce((acc, handler) =>	acc.then((result) => {
				lastTransformedInput = result || lastTransformedInput;
				return handler(lastTransformedInput, input);
			}), Promise.resolve(lastTransformedInput))
			.then((result) => result || lastTransformedInput)
			.catch((originalError) => {

				let error = new Error('Interceptor failed');
				error.original = originalError;
				error.result = lastTransformedInput;

				return Promise.reject(error);
			});

	}



};
