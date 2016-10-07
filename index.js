'use strict';


module.exports = class Atween {

	constructor() {
		this._hooks = {};
	}

	inputInterceptor() {

	}

	outputInterceptor() {

	}

	register(name) {
		let stack = this._getOrCreateHookStack(name);
	}

	run(name) {
		let stack = this._getHookStack(name);
	}






	_getOrCreateHookStack(name) {

		let stack;

		try {
			stack = this._getHookStack(name);
		} catch(e) {
			stack = [];
		}

		this._hooks[name] = stack;

		return stack;
	}

	_getHookStack(name) {

		let stack = this._hooks[name];

		if(!stack) {
			throw new Error('Hook-Stack not found');
		}

		return stack;
	}



}
