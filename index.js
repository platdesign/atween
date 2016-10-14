'use strict';

const InterceptorController = require('./lib/interceptor-controller');



module.exports = class Atween {

	constructor() {

		this.interceprors = new InterceptorController();

	}

	/**
	 * Register an interceptor
	 *
	 * An interceptor expects two input parameters.
	 * 1. Previous result
	 * 2. Original input
	 *
	 * @param  {[type]} name   [description]
	 * @param  {[type]} config [description]
	 * @return {[type]}        [description]
	 */
	registerInterceptor(name, config) {
		this.interceprors.register(name, config);
		return this;
	}

	runInterceptors(name, input, ctx) {
		return this.interceprors.run(name, input, ctx);
	}




};
