'use strict';

const ctxq = require('ctxq');
const InterceptorController = require('./interceptor-controller');
const HookController = require('./hook-controller');




module.exports = class HookStack {

	constructor(name) {
		this.name = name;
		this.inputInterceptors = new InterceptorController();
		this.outputInterceptors = new InterceptorController();
		this.hooks = new HookController();
	}


	run(input) {

		return ctxq()
			.push('input', () => this.inputInterceptors.run(input))
			.push('rawOutput', (scope) => this.hooks.run(scope.input))
			.push('output', (scope) => this.outputInterceptors.run(scope.rawOutput))
			.run()
			.then((scope) => scope.output);
	}


	registerHook(name, config) {
		this.hooks.register(config);
		return this;
	}


	registerInputInterceptor(config) {
		this.inputInterceptors.register(config);
		return this;
	}


	registerOutputInterceptor(config) {
		this.outputInterceptors.register(config);
		return this;
	}

};
