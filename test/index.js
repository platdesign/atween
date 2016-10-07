'use strict';


const Code = require('code');
const expect = Code.expect;
const Atween = require('../');



describe('atween', function() {

	it('should create instance', () => {

		let instance = new Atween();

		expect(instance).to.be.an.object();

	});

})
