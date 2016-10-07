'use strict';

const ctxq = require('ctxq');






module.exports = class HookStack {


	constructor(name) {
		this.name = name;
		this.inputInterceptors = [];
		this.outputInterceptors = [];
		this.hooks = [];
	}





	run(input) {

		return ctxq()
			.push('input', () => this._runInputInterceptors(input))
			.push('rawOutput', (scope) => this._runHooksQ(scope.input))
			.push('output', (scope) => this._runOutputInterceptors(scope.rawOutput))
			.run()
			.then((scope) => scope.output);

	}





	registerHook(name, config) {

		if(!config.priority) {
			config.priority = 1000;
		}

		if(!config.name) {
			throw new Error('Invalid hook name');
		}

		this.hooks.push(config);

		this.hooks.sort((a, b) => {
			return a.priority - b.priority;
		});

	}






	registerInputInterceptor(config) {

		config = this._sanitizeInterceptorConfig(config);

		this.inputInterceptors.push(config);

		this.inputInterceptors.sort((a, b) => {
			return a.priority - b.priority;
		});

	}






	registerOutputInterceptor(config) {

		config = this._sanitizeInterceptorConfig(config);

		this.outputInterceptors.push(config);

		this.outputInterceptors.sort((a, b) => {
			return a.priority - b.priority;
		});

	}










	_sanitizeInterceptorConfig(config) {
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
		return config;
	}





	_runInterceptors(interceptors, input) {

		let lastTransformedInput = input;

		return interceptors
			.map((config) => config.handler)
			.reduce((acc, handler) =>	acc.then((result) => {
				lastTransformedInput = result || lastTransformedInput;
				return handler(lastTransformedInput);
			}), Promise.resolve(lastTransformedInput))
			.then((result) => result || lastTransformedInput);

	}





	_runInputInterceptors(input) {
		return this._runInterceptors(this.inputInterceptors, input);
	}





	_runOutputInterceptors(rawOutput) {
		return this._runInterceptors(this.outputInterceptors, rawOutput);
	}





	_runHooksQ(input) {

		let q = ctxq();

		this.hooks.map((config) => {
			q.push(config.name, () => config.handler(input));
		});

		return q.run();

	}




};
