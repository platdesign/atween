'use strict';

const HookCtrl = require('./lib/hook-controller');




module.exports = class Atween {

	constructor() {

		this._hooks = new HookCtrl();

	}

	registerHook(name, config) {

	}

	registerMiddleware(name, config) {

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

	}

	registerEvent(name, config) {

	}

};
