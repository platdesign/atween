# atween

Hooking into Business Logic

[![Build Status](https://travis-ci.org/platdesign/atween.svg?branch=master)](https://travis-ci.org/platdesign/atween)

# Install

`npm install --save atween`


# Main concepts



## Interceptors

Basically an interceptor transforms a given input an returns it. If there are multiple interceptors registered on the same case they will get the result of its antecessor as input. Additionally they will get the `original`-input as second parameter. If an error occurs inside of an interceptor the error object will be decorated with `$prevResult` and `$input`. Interceptors run sequentially based on their `priority` and can return a `Promise` if transformation needs async operations. If an interceptor does not return a value (or s.th. like `null` or `undefined`) it will pipe through its input value.
Interceptor methods can have an execution context (`this`).


## Hook

Hooks can be registered on a specific `case` with a unique `name`. Running a `case` with multiple hooks registered on it will execute all hook-handlers sequentially by `priority`. The first parameter passed into each hook-handler is the `input` given by the executor. Its result will be stored on a `result`-object with given `name` as key. The `result`-object is passed into each hook-handler as second paramter. If all hook-handlers of a `case` run successfully the `result`-object will be returned. Hook-handlers can return a `Promise` to do async stuff. A hook without a name will not have a `result`-object as second parameter and its return value will be ignored except its a `Promise` which would be used to defer the sequential-run. Thats very important and differs from an [Event]()!


## Event ##

Events work by the concept of "Fire and Forget". They will not wait for async operations of previous event-handlers. Its return value can be `true` or `false` but for logging purpose only.






# Usage

```javascript
const Atween = require('atween');

const atween = new Atween();



atween.register('user:signup', {
	name: 'userObject',
	priority: 100,
	handler: function (input) {
		return db.createUser(input);
	}
});

atween.register('user:signup', {
	name: 'send-welcome-mail',
	priority: 5000,
	handler: function (input) {
		return this.userObject.sendWelcomeMail();
	}
});



atween.registerInputInterceptor('user:signup', function(input) {
	if(!input.username) {
		throw new Error('Missing username');
	}
});



atween.run('user:signup', {
	// ... user credentials
})
.then((result) => console.log('Success!'));


```


# Author

[@platdesign](https://twitter.com/platdesign)

# License
