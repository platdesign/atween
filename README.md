# atween

Hooking into Business Logic

[![Build Status](https://travis-ci.org/platdesign/atween.svg?branch=master)](https://travis-ci.org/platdesign/atween)

# Install

`npm install --save atween`

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
