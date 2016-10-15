'use strict';

const ControllerBase = require('./controller-base');
const Hook = require('./hook');

module.exports = class HookController extends ControllerBase {

	register(name, config) {
		let store = this._getOrCreateStore(name);

		store.push(new Hook(config));
		store.sort((a, b) => {
			return a.priority - b.priority;
		});

		return this;
	}


	run(name, input, self, invoker) {
		let store = this._getOrCreateStore(name);

		const results = {};

		return store.reduce((acc, item) =>
			acc.then(() =>
				item.run(input, results, self, invoker)
			), Promise.resolve(input)
		)
		.then(() => results);
	}

};
