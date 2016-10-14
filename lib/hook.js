'use strict';

const extend = require('extend');
const is = require('is');



const baseConfig = {
	priority: 1000
};



module.exports = class Hook {

	constructor(config) {

		if(is.fn(config)) {
			config = {
				handler: config
			};
		}

		config = extend(true, {}, baseConfig, config);

		this.id = config.name;
		this.priority = config.priority;
		this._handler = config.handler;
	}



	run(input, ctx, self) {
		return Promise.resolve()
			.then(() => this._handler.apply(self, [input, ctx]))
			.then((res) => this.id ? ctx[this.id] = res : res);
	}

};
