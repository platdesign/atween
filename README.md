# atween

Hooking into Business Logic

[![Build Status](https://travis-ci.org/platdesign/atween.svg?branch=master)](https://travis-ci.org/platdesign/atween)

# Install

`npm install --save atween`


# Main concepts

## Interceptors

Basically an interceptor transforms a given input an returns it. If there are multiple interceptors registered on the same case they will get the result of its antecessor as input. Additionally they will get the `original`-input as second parameter. If an error occurs inside of an interceptor the error object will be decorated with `$prevResult` and `$input`. Interceptors run sequentially based on their `priority` and can return a `Promise` if transformation needs async operations. If an interceptor does not return a value (or s.th. like `null` or `undefined`) it will pipe through its input value.





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
