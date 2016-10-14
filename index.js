'use strict';

const InterceptorController = require('./lib/interceptor-controller');
const HookController = require('./lib/hook-controller');



module.exports = class Atween {

	constructor() {
		this.interceptors = new InterceptorController();
		this.hooks = new HookController();
	}


	/**
	 * Registers an interceptor on a specific case
	 * @param  {String} name   Name of case
	 * @param  {Object|Function} config Configures the interceptor with handler and priority
	 * @return {Object}        self for method chaining
	 */
	registerInterceptor(name, config) {
		this.interceptors.register(name, config);
		return this;
	}

	/**
	 * Executes all interceptors of a specific case with input and optional execution-context.
	 * @param  {String} name  Name of case
	 * @param  {Any} input Input value which should be transformed by registered interceptors.
	 * @param  {Object} ctx   Execution context of handler methods.
	 * @return {Promise}      resolves with transformed input.
	 */
	runInterceptors(name, input, ctx) {
		return this.interceptors.run(name, input, ctx);
	}






};
