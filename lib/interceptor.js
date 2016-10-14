'use strict';

const extend = require('extend');
const is = require('is');



const baseConfig = {
	priority: 1000
};



module.exports = class Interceptor {

	constructor(config) {

		if(is.fn(config)) {
			config = {
				handler: config
			};
		}

		config = extend(true, {}, baseConfig, config);

		this.priority = config.priority;
		this._handler = config.handler;
	}

	run(prevResult, origInput, self) {
		return Promise.resolve()
			.then(() => this._handler.apply(self, [prevResult, origInput]))
			.then((res) => res || prevResult)
			.catch((err) => {
				err.$prevResult = prevResult;
				err.$input = origInput;
				throw err;
			});
	}

};
