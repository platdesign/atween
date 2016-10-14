'use strict';



module.exports = class ControllerBase {

	constructor() {

		this._stores = {};

	}

	_getOrCreateStore(name) {
		if(this._stores[name]) {
			return this._stores[name];
		}

		return (this._stores[name] = []);
	}


};
