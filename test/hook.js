'use strict';

const Code = require('code');
const expect = Code.expect;

const Hook = require('../lib/hook');
const HookController = require('../lib/hook-controller');


describe('Hook', () => {

	it('should create instance', () => {

		const hook = new Hook({
			name: 'test',
			handler: function() {}
		});

		expect(hook.run)
			.to.be.a.function();

		expect(hook.priority)
			.to.equal(1000);

		expect(hook.id)
			.to.equal('test');

	});


	it('should execute handler as expected', () => {

		const ctx = {};
		const resultCtx = {};

		const hook = new Hook({
			name: 'test',
			handler: function(input, results) {

				expect(this).to.shallow.equal(ctx);
				expect(results).to.shallow.equal(resultCtx);

				return input * 2;
			}
		});

		return hook.run(1, resultCtx, ctx)
			.then((res) => expect(res).to.equal(2));

	});


	it('should execute handler as expected (promised)', () => {

		const ctx = {};
		const resultCtx = {};

		const hook = new Hook({
			name: 'test',
			handler: function(input, results) {

				expect(this).to.shallow.equal(ctx);
				expect(results).to.shallow.equal(resultCtx);

				return Promise.resolve(input * 2);
			}
		});

		return hook.run(1, resultCtx, ctx)
			.then((res) => expect(res).to.equal(2));

	});




	it('should accept a handler as config parameter', () => {

		const ctx = {};
		const resultCtx = {};

		const hook = new Hook(function(input, results) {
			expect(this).to.shallow.equal(ctx);
			expect(results).to.shallow.equal(resultCtx);

			return Promise.resolve(input * 2);
		});

		expect(hook.priority).to.equal(1000);
		expect(hook.id).to.be.undefined();

		return hook.run(1, resultCtx, ctx)
			.then((res) => expect(res).to.equal(2));

	});


});







describe('HookController', () => {

	let hooks;
	beforeEach(() => hooks = new HookController());


	it('should execute with given exec-scope', () => {

		const ctx = {};

		hooks
			.register('test', {
				handler: function(input) {

					expect(input).to.equal(1);
					expect(this).to.shallow.equal(ctx);

					return 1;
				}
			})
			.register('test', {
				handler: function(input) {

					expect(input).to.equal(1);
					expect(this).to.shallow.equal(ctx);

					return 2;
				}
			});

		return hooks.run('test', 1, ctx)
			.then((res) => expect(res).to.equal({}));

	});


	it('should run in expected order', () => {

		hooks
			.register('test', {
				name: 'A',
				handler: function(input, ctx) {

					expect(input).to.equal(1);
					expect(ctx).to.equal({});

					return 1;
				}
			})
			.register('test', {
				name: 'B',
				handler: function(input, ctx) {

					expect(input).to.equal(1);
					expect(ctx).to.equal({ 'A':1 });

					return 2;
				}
			});

		return hooks.run('test', 1)
			.then((res) => expect(res).to.equal({ 'A':1, 'B':2 }));

	});


	it('should run in expected order (with priority)', () => {

		hooks
			.register('test', {
				name: 'A',
				priority: 1500,
				handler: function(input, ctx) {

					expect(input).to.equal(1);
					expect(ctx).to.equal({ 'B':2, 'C':3 });

					return 1;
				}
			})
			.register('test', {
				name: 'B',
				priority: 500,
				handler: function(input, ctx) {

					expect(input).to.equal(1);
					expect(ctx).to.equal({});

					return Promise.resolve(2);
				}
			})
			.register('test', {
				name: 'C',
				handler: function(input, ctx) {

					expect(input).to.equal(1);
					expect(ctx).to.equal({ 'B':2 });

					return 3;
				}
			});

		return hooks.run('test', 1)
			.then((res) => expect(res).to.equal({ 'A':1, 'B':2, 'C':3 }));

	});

});












