'use strict';

const Code = require('code');
const expect = Code.expect;

const Interceptor = require('../lib/interceptor');
const InterceptorController = require('../lib/interceptor-controller');



describe('Interceptor', () => {



	it('should create instance', () => {

		let instance = new Interceptor({});

		expect(instance)
			.to.be.an.object();

		expect(instance.priority)
			.to.equal(1000);

		expect(instance.run)
			.to.be.a.function();

	});


	it('should accept handler as config object in constructor', () => {
		let instance = new Interceptor((prev, original) => 'test'+prev);

		expect(instance.priority).to.equal(1000);

		return instance.run(1, 2).then((res) => expect(res).to.equal('test'+1));
	});


	it('should execute handler like expected', () => {

		let instance = new Interceptor({
			handler: function(a, b) {
				return 'test'+a+b;
			}
		});

		return instance.run(1, 2)
			.then((res) => expect(res).to.equal('test12'));

	});




	it('should execute handler like expected (promised result)', () => {

		let instance = new Interceptor({
			handler: function(a, b) {
				return Promise.resolve('test'+a+b);
			}
		});

		return instance.run(1, 2)
			.then((res) => expect(res).to.equal('test12'));

	});



	it('handler without return should return previous result', () => {

		let instance = new Interceptor({
			handler: () => null
		});

		return instance.run(1, 2)
			.then((res) => expect(res).to.equal(1));

	});




	it('if executed with scope it should be used as context for handler', () => {

		let ctx = {};

		let instance = new Interceptor({
			handler: function() {
				return this;
			}
		});

		return instance.run(1, 2, ctx)
			.then((res) => expect(res).to.shallow.equal(ctx));

	});





	it('error should be catched and have $prevResult and original $input', () => {

		let instance = new Interceptor({
			handler: () => { throw new Error('test'); }
		});

		return instance.run(1, 2)
			.then(
				(res) => { throw new Error('Should not be executed!'); },
				(err) => {
					expect(err).to.be.an.error('test', Error);
					expect(err.$input).to.equal(2);
					expect(err.$prevResult).to.equal(1);
				}
			);

	});






});




describe('Interceptor-Controller', () => {

	let instance;
	beforeEach(() => instance = new InterceptorController());

	it('should have method register()', () => {
		expect(instance.register).to.be.a.function();
	});

	it('should have method run()', () => {
		expect(instance.run).to.be.a.function();
	});

	it('should run registered interceptors with expected output (without priority)', () => {

		instance.register('test', {
			handler: function(prev, original) {
				return 'test'+prev;
			}
		});

		instance.register('test', {
			handler: function(prev, original) {
				return prev+original;
			}
		});

		instance.register('test', {
			handler: () => null
		});

		instance.register('test', {
			handler: function(prev, original) {
				return original + prev;
			}
		});

		return instance.run('test', 1)
			.then((res) => expect(res).to.equal('1test11'));

	});


	it('should run registered interceptors with expected output (with priority)', () => {

		instance.register('test', {
			priority: 300,
			handler: function(prev, original) {
				return original + prev;
			}
		});

		instance.register('test', {
			priority: 100,
			handler: function(prev) {
				return 'test'+prev;
			}
		});

		instance.register('test', {
			priority: 250,
			handler: () => null
		});

		instance.register('test', {
			priority: 200,
			handler: function(prev, original) {
				return prev+original;
			}
		});

		return instance.run('test', 1)
			.then((res) => expect(res).to.equal('1test11'));

	});




	it('should run with context', () => {

		const ctx = {};

		instance.register('test', {
			handler: function(prev) {
				expect(this).to.shallow.equal(ctx);
				return 'test'+prev;
			}
		});

		instance.register('test', {
			handler: function(prev, original) {
				expect(this).to.shallow.equal(ctx);
				return prev+original;
			}
		});

		instance.register('test', {
			handler: function(prev, original) {
				expect(this).to.shallow.equal(ctx);
				return original + prev;
			}
		});

		return instance.run('test', 1, ctx)
			.then((res) => expect(res).to.equal('1test11'));
	});






});
