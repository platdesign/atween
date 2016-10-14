# atween

Hooking into Business Logic




[![Build Status](https://travis-ci.org/platdesign/atween.svg?branch=master)](https://travis-ci.org/platdesign/atween)
[![Current Version](https://img.shields.io/npm/v/atween.svg)](https://www.npmjs.com/package/atween)

Lead Maintainer: [Christian Blaschke](https://github.com/platdesign)


- Atween
	- [Install](#install)
	- [Concepts](#concepts)
		- [Interceptors](#interceptors)
			- [`registerInterceptor(case, config)`](#registerinterceptorcase-config)
			- [`runInterceptors(case, input, [context])`](#runinterceptorscase-input-context)
		- [Hooks](#hooks)
			- [`registerHook(case, config)`](#registerhookcase-config)
			- [`runHooks(case, input, [context])`](#runhookscase-input-context)
		- [Events](#events)
			- [`registerEvent(case, config)`](#registereventcase-config)
			- [`runEvents(case, input, [context])`](#runeventscase-input-context)
		



# Install

`npm install --save atween`


# Concepts


## Interceptors

Basically an interceptor transforms a given input an returns it. If there are multiple interceptors registered on the same case they will get the result of its antecessor as input. Additionally they will get the `original`-input as second parameter. If an error occurs inside of an interceptor the error object will be decorated with `$prevResult` and `$input`. Interceptors run sequentially based on their `priority` and can return a `Promise` if transformation needs async operations. If an interceptor does not return a value (or s.th. like `null` or `undefined`) it will pipe through its input value.
Interceptor methods can have an execution context (`this`).

### Methods

- [`registerInterceptor(case, config)`](#registerinterceptorcase-config)
- [`runInterceptors(case, input, [context])`](#runinterceptorscase-input-context)




#### `registerInterceptor(case, config)`

- `case` - (*String*) Name of the `case` as a string.
- `config` - (*Object*|*Function*)

	If given config is a function it will be used as handler.
	
	- `priority` - (*Number*) Give a priority to influence execution order. (Default: 1000) 
	- `handler(prevResult, originalInput)` The "transform"-logic function.

```js
atween.registerInterceptor('myUseCase', {
	priority: 500,
	handler: function(prevResult, originalInput) {
		return prevResult + 1;
	}
});
```

or without specific priority:

```js
atween.registerInterceptor('myUseCase', function(prevResult, originalInput) {
	return prevResult + 1;
});
```





#### `runInterceptors(case, input, [context])`

Returns a `Promise` which resolves with the result of the last executed interceptor-handler. In case of an error it rejects with an error having two additional attribtues: `$prevResult` and `$input`.

- `case` - (*String*) Name of the `case` as a string.
- `input` - Every input which should run through the chain of registered interceptors.
- `context` - (*Object*) Give a specific object which will be used as execution context of each `handler`.


```js
atween.registerInterceptor('myUseCase', {
	priority: 500, // Default is 1000
	handler: function(prevResult, originalInput) {
		return prevResult + 1;
	}
});
// result: 5 + 1 = 6

atween.registerInterceptor('myUseCase', {
	// Will run with default priority of 1000
	handler: function(prevResult, originalInput) {
		return prevResult + originalInput;
	}
});
// result: 6 + 5 = 11

atween.registerInterceptor('myUseCase', {
	priority: 1500,
	handler: function(prevResult, originalInput) {
		return prevResult * this.factor;
	}
});
// result: 11 * 2 = 22

atween.runInterceptors('myUseCase', 5, { factor: 2 })
	.then((res) => expect(res).to.equal(22));
```



















## Hook

Hooks can be registered on a specific `case` with a unique `name`. Running a `case` with multiple hooks registered on it will execute all hook-handlers sequentially by `priority`. The first parameter passed into each hook-handler is the `input` given by the executor. Its result will be stored on a `result`-object with given `name` as key. The `result`-object is passed into each hook-handler as second paramter. If all hook-handlers of a `case` run successfully the `result`-object will be returned. Hook-handlers can return a `Promise` to do async stuff. A hook without a name will not have a `result`-object as second parameter and its return value will be ignored except its a `Promise` which would be used to defer the sequential-run. Thats very important and differs from an [Event](#event)!


## Event

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
