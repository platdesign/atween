'use strict';

const HookStack = require('./lib/hook-stack');



module.exports = class Atween {



	constructor() {
		this._hooks = {};
	}



	register(name, config) {

		this._getOrCreateHookStack(name)
			.registerHook(name, config);

		return this;
	}



	registerInputInterceptor(name, config) {

		this._getOrCreateHookStack(name)
			.registerInputInterceptor(config);

		return this;
	}



	registerOutputInterceptor(name, config) {

		this._getOrCreateHookStack(name)
			.registerOutputInterceptor(config);

		return this;
	}



	run(name, input) {
		return this._getHookStack(name).run(input);
	}










	_createHookStack(name) {

		if(this._hooks[name]) {
			throw new Error(`Hook-Stack (${name}) already exists`);
		}

		let stack = new HookStack(name);

		return (this._hooks[name] = stack);
	}




	_getHookStack(name) {

		let stack = this._hooks[name];

		if(!stack) {
			throw new Error('Hook-Stack not found');
		}

		return stack;
	}


	_getOrCreateHookStack(name) {

		let stack;

		try {
			stack = this._getHookStack(name);
		} catch(e) {
			stack = this._createHookStack(name);
		}

		this._hooks[name] = stack;

		return stack;
	}







};
