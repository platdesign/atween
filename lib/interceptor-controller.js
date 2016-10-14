'use strict';

const ControllerBase = require('./controller-base');
const Interceptor = require('./interceptor');

module.exports = class InterceptorController extends ControllerBase {

	register(name, config) {
		let store = this._getOrCreateStore(name);

		store.push(new Interceptor(config));
		store.sort((a, b) => {
			return a.priority - b.priority;
		});
	}


	run(name, input, ctx) {
		let store = this._getOrCreateStore(name);

		return store.reduce((acc, item) =>
			acc.then((prev) =>
				item.run(prev, input, ctx)
			), Promise.resolve(input)
		);
	}

};
