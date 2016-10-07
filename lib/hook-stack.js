'use strict';

const ctxq = require('ctxq');

const InterceptorController = require('./interceptor-controller');




module.exports = class HookStack {


	constructor(name) {
		this.name = name;
		this.inputInterceptors = new InterceptorController();
		this.outputInterceptors = new InterceptorController();
		this.hooks = [];
	}


	run(input) {

		return ctxq()
			.push('input', () => this.inputInterceptors.run(input))
			.push('rawOutput', (scope) => this._runHooksQ(scope.input))
			.push('output', (scope) => this.outputInterceptors.run(scope.rawOutput))
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
		this.inputInterceptors.register(config);
	}


	registerOutputInterceptor(config) {
		this.outputInterceptors.register(config);
	}



	_runHooksQ(input) {

		let q = ctxq();

		this.hooks.map((config) => {
			q.push(config.name, (context) => config.handler.apply(context, [input]));
		});

		return q.run();

	}




};
