'use strict';


const Code = require('code');
const expect = Code.expect;
const Atween = require('../');




describe('atween', function() {


	let instance;

	beforeEach(() => instance = new Atween());

	it('should be an object', () => expect(instance).to.be.an.object());
	it('should be an instance of Atween', () => expect(instance).to.be.instanceOf(Atween));
	it('should have method: registerInputInterceptor', () => expect(instance.registerInputInterceptor).to.be.a.function());
	it('should have method: register', () => expect(instance.register).to.be.a.function());
	it('should have method: registerOutputInterceptor', () => expect(instance.registerOutputInterceptor).to.be.a.function());
	it('should have method: run', () => expect(instance.run).to.be.a.function());

	it('should have private hooks-store', () => expect(instance._hooks).to.be.an.object());
	it('should have private method: _getOrCreateHookStack', () => expect(instance._getOrCreateHookStack).to.be.a.function());

	it('_getOrCreateHookStack() should return new stack', () => {

		let stack = instance._getOrCreateHookStack('test');

		expect(stack)
			.to.be.an.object();

	});


	it('should have private method: _getHookStack', () => expect(instance._getHookStack).to.be.a.function());




	it('_getHookStack() should throw error on unknown stack', () => {

		expect(() => instance._getHookStack('test'))
			.to.throw(Error, 'Hook-Stack not found');

	});



	it('_getHookStack() should return expected stack', () => {

		let stack = instance._createHookStack('test');

		expect(instance._getHookStack('test'))
			.to.be.an.object()
			.to.shallow.equal(stack);

		expect(instance._getOrCreateHookStack('test'))
			.to.be.an.object()
			.to.shallow.equal(stack);

	});



	it('register() should return self for method chaining', () => {

		let res = instance.register('test', {
			name: 'a',
			handler: function() {}
		});

		expect(res)
			.to.shallow.equal(instance);

	});





	it('hooks should return expected result', () => {

		instance
			.register('test', {
				name: 'a',
				handler: () => 'A'
			})
			.register('test', {
				name: 'b',
				handler: () => 'B'
			});

		return instance.run('test').then((res) => expect(res).to.equal({
			a: 'A',
			b: 'B'
		}));

	});





	it('hooks should return expected result (promised)', () => {

		instance
			.register('test', {
				name: 'a',
				handler: () => Promise.resolve('A')
			})
			.register('test', {
				name: 'b',
				handler: () => Promise.resolve('B')
			});

		return instance.run('test').then((res) => expect(res).to.equal({
			a: 'A',
			b: 'B'
		}));

	});






	it('hooks should run in expected order (without priority)', () => {

		let order = [];

		instance
			.register('test', {
				name: 'a',
				handler: () => order.push('A')
			})
			.register('test', {
				name: 'b',
				handler: () => order.push('B')
			})
			.register('test', {
				name: 'c',
				handler: () => order.push('C')
			});

		return instance.run('test').then(() => expect(order).to.equal(['A', 'B', 'C']));

	});






	it('hooks should run in expected order (with priority)', () => {

		let order = [];

		instance
			.register('test', {
				name: 'b',
				priority: 200,
				handler: () => order.push('A')
			})
			.register('test', {
				name: 'a',
				priority: 100,
				handler: () => order.push('B')
			})
			.register('test', {
				name: 'c',
				priority: 300,
				handler: () => order.push('C')
			});

		return instance.run('test').then(() => expect(order).to.equal(['B', 'A', 'C']));

	});






	it('hooks should receive input value', () => {

		instance.register('test', {
			name: 'a',
			handler: function(input) {
				return input * 3;
			}
		});


		instance.registerInputInterceptor('test', {
			handler: function(input) {
				return input * 3;
			}
		});


		instance.registerOutputInterceptor('test', {
			handler: function(input) {
				input.a /= 3;
				return input;
			}
		});



		return instance.run('test', 3)
			.then((res) => expect(res).to.equal({ a: 9 }));

	});


	it('if inputInterceptor does not return a value input value should not change', () => {

		instance.registerInputInterceptor('test', {
			handler: function() {
				// DO NOT RETURN ANY VALUE
			}
		});

		instance.registerInputInterceptor('test', {
			handler: function(input) {
				return input + 123;
			}
		});

		instance.register('test', {
			name: 'a',
			handler: function(input) {
				return input;
			}
		});

		return instance.run('test', 'A')
			.then((res) => expect(res).to.equal({ a: 'A123' }));

	});






	it('run() should reject on inputInterceptor error', () => {

		instance.registerInputInterceptor('test', {
			handler: function(input) {
				if(!input) {
					throw new Error('test-error');
				}
			}
		});


		return instance.run('test')
			.then(
				() => { throw new Error('Should not resolve'); },
				(err) => expect(err).to.be.an.instanceOf(Error)
			);

	});












	describe('inputInterceptors', () => {

		it('should execute in expected order', () => {

			instance.registerInputInterceptor('test', {
				handler: function(input) {
					return input + 1;
				}
			});

			instance.registerInputInterceptor('test', {
				handler: function(input) {
					return input + 2;
				}
			});

			instance.registerInputInterceptor('test', {
				handler: function(input) {
					return input + 3;
				}
			});

			instance.register('test', {
				name: 'a',
				handler: function(input) {
					return input;
				}
			});


			return instance.run('test', 'A')
				.then((res) => expect(res).to.equal({ a: 'A123' }));

		});


		it('should execute in expected order (with priorities)', () => {

			instance.registerInputInterceptor('test', {
				priority: 300,
				handler: function(input) {
					return input + 1;
				}
			});

			instance.registerInputInterceptor('test', {
				priority: 200,
				handler: function(input) {
					return input + 2;
				}
			});

			instance.registerInputInterceptor('test', {
				priority: 100,
				handler: function(input) {
					return input + 3;
				}
			});

			instance.register('test', {
				name: 'a',
				handler: function(input) {
					return input;
				}
			});


			return instance.run('test', 'A')
				.then((res) => expect(res).to.equal({ a: 'A321' }));

		});

	});


	describe('outputInterceptors', () => {

		it('should execute in expected order', () => {

			instance.registerOutputInterceptor('test', {
				handler: function(result) {
					result.a += 1;
				}
			});

			instance.registerOutputInterceptor('test', {
				handler: function(result) {
					result.a += 2;
				}
			});

			instance.registerOutputInterceptor('test', {
				handler: function(result) {
					result.a += 3;
				}
			});

			instance.register('test', {
				name: 'a',
				handler: function(input) {
					return input;
				}
			});


			return instance.run('test', 'A')
				.then((res) => expect(res).to.equal({ a: 'A123' }));

		});


		it('should execute in expected order (with priorities)', () => {

			instance.registerOutputInterceptor('test', {
				priority: 300,
				handler: function(result) {
					result.a += 1;
				}
			});

			instance.registerOutputInterceptor('test', {
				priority: 200,
				handler: function(result) {
					result.a += 2;
				}
			});

			instance.registerOutputInterceptor('test', {
				priority: 100,
				handler: function(result) {
					result.a += 3;
				}
			});

			instance.register('test', {
				name: 'a',
				handler: function(input) {
					return input;
				}
			});


			return instance.run('test', 'A')
				.then((res) => expect(res).to.equal({ a: 'A321' }));

		});

	});



});
