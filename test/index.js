'use strict';


const Code = require('code');
const expect = Code.expect;
const Atween = require('../');



describe('atween', function() {

	describe('instance', () => {

		let instance;

		beforeEach(() => instance = new Atween());

		it('should be an object', () => expect(instance).to.be.an.object());
		it('should be an instance of Atween', () => expect(instance).to.be.instanceOf(Atween));
		it('should have method: inputInterceptor', () => expect(instance.inputInterceptor).to.be.a.function());
		it('should have method: register', () => expect(instance.register).to.be.a.function());
		it('should have method: outputInterceptor', () => expect(instance.outputInterceptor).to.be.a.function());
		it('should have method: run', () => expect(instance.run).to.be.a.function());

		it('should have private hooks-store', () => expect(instance._hooks).to.be.an.object());
		it('should have private method: _getOrCreateHookStack', () => expect(instance._getOrCreateHookStack).to.be.a.function());

		it('_getOrCreateHookStack() should return new stack', () => {

			let stack = instance._getOrCreateHookStack('test');

			expect(stack)
				.to.be.an.array()
				.have.length(0);

		});


		it('should have private method: _getHookStack', () => expect(instance._getHookStack).to.be.a.function());

		it('_getHookStack() should throw error on unknown stack', () => {

			expect(() => instance._getHookStack('test'))
				.to.throw(Error, 'Hook-Stack not found')

		});

		it('_getHookStack() should return expected stack', () => {

			instance._hooks['test'] = [1, 2, 3];

			expect(instance._getHookStack('test'))
				.to.be.an.array()
				.to.have.length(3)
				.to.equal([1,2,3]);

		});

	});

});
