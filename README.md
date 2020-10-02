# esn-frontend-mailto-handler
Mailto handler

## How to use it

```html
<a op-inbox-compose ng-href="mailto:usera@acme.com,userb@example.io" >Send mail</a>
```

### Options

#### op-inbox-compose-users

An array of user objects. This attribute is parsed through AngularJS $parse. A user object can be:

* { name, email }

Example:

```html
<a op-inbox-compose op-inbox-compose-users='[{name: "John Doe", email: "jdoe@acme.com"}]' >Send mail</a>
```

* { displayName, email }

Example:

```html
<a op-inbox-compose op-inbox-compose-users='[{displayName: "John Doe", email: "jdoe@acme.com"}]' >Send mail</a>
```
* { firstname, lastname, email }

Example:

```html
<a op-inbox-compose op-inbox-compose-users='[{firstName: "John", "lastName": "Doe", email: "jdoe@acme.com"}]' >Send mail</a>
```

* All the previous cases, but with **preferredEmail** instead of **email**

Example:

```html
<a op-inbox-compose op-inbox-compose-users='[{name: "John Doe", preferredEmail: "jdoe@acme.com"}]' >Send mail</a>
```

* { email }

Example:

```html
<a op-inbox-compose op-inbox-compose-users='[{email: "jdoe@acme.com"}]' >Send mail</a>
```

* { preferredEmail }

Example:

```html
<a op-inbox-compose op-inbox-compose-users='[{preferredEmail: "jdoe@acme.com"}]' >Send mail</a>
```

#### op-inbox-compose-height

By default, the opened window has a 600px height. It's possible to set the height.

Example:

```html
<a op-inbox-compose ng-href="mailto:usera@acme.com,userb@example.io" op-inbox-compose-height="1000">Send mail</a>
```

#### op-inbox-compose-width

By default, the opened window has a 800px width. It's possible to set the width.

Example:

```html
<a op-inbox-compose ng-href="mailto:usera@acme.com,userb@example.io" op-inbox-compose-width="1200">Send mail</a>
```

