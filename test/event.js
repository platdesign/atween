'use strict';

const Code = require('code');
const expect = Code.expect;

const EventController = require('../lib/event-controller');



describe('EventController', () => {

	let events;
	beforeEach(() => events = new EventController());


	it('', () => {

		events.on('test', (input) => {
			expect(input).to.equal(123);
		});


		return events.emit('test', 123);

	});

});
