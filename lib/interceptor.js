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

	run(prevResult, origInput, self, invoke) {

		invoke = invoke || function(handler, prevResult, origInput, self) {
			return handler.apply(self, [prevResult, origInput]);
		};

		return Promise.resolve()
			.then(() => invoke(this._handler, prevResult, origInput, self))
			.then((res) => res || prevResult)
			.catch((err) => {
				err.$prevResult = prevResult;
				err.$input = origInput;
				throw err;
			});
	}

};
