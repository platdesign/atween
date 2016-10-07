'use strict';

const ctxq = require('ctxq');


module.exports = class HookController {

	constructor() {
		this.store = [];
	}


	register(config) {

		if(!config.priority) {
			config.priority = 1000;
		}

		if(!config.name) {
			throw new Error('Invalid hook name');
		}

		this.store.push(config);

		this.store.sort((a, b) => {
			return a.priority - b.priority;
		});

	}


	run(input) {

		let q = ctxq();

		this.store.map((config) => {
			q.push(config.name, (context) => config.handler.apply(context, [input]));
		});

		return q.run();
	}

};
