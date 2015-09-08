# Quizlet (v1.0)
Quizlet is a full service poll/quiz system for use on web sites.  It provides an Express middleware backend that serves as the REST-like endpoint for quizes; and it provides a client-side Javascript SDK for loading the interface on your web site.

> **NOTE**: The names in this README are using the future 'final' names for packages and pieces and may not reflect the current state of development in the repository. It is intended to reflect the way setup would occur if this project were fully complete.



### Requirements
Quizlet client-side SDK includes jQuery, though it would be nice to remove that as a dependency in the future.

### Dependencies
Run and pull down all the dependencies needed.

```
$ npm install
```
## Installation

### Database Setup
Ensure you have a MySQL database setup and accessible. Then, run the `sql/tables.sql` script to setup the `quizlet` database and a user named `admin` that will have access.  This script will also create some test data.

```shell
$ mysql -u root -p < sql/tables.sql
```
You should now be able to access the quizlet databse as follows from localhost. Do change default password to something different before running in a production environment.

```
$ mysql -u admin -psumome quizlet
```

### Express Middleware
In your express application, you can simply include the `quizlet-service.js` and run it to create the routes and services.

```javascript
var quizlet = require('./quizlet-service.js'),

// Setup Quizlet API route middleware
app.use('/api', quizlet);
```

### Use the Client SDK
In your client-side application, on the page you wish the polls to display on, simply include the built javascript and stylesheet.

```
<head>
    <link rel="stylesheet" href="quizlet.min.css" type="text/css"/>
</head>
<body>
    <!-- other stuff on your page -->
    <script type="text/javascript" src="quizlet.js"></script>
</body>
```
Then, kick everything off by calling the `.init()` method.  You can configure quizlet by passing in a configuration object to the `.init()` method.
```
var quizlet = require('./poll.js');

// Kick off Quizlet running....
quizlet.init({
    url: config.url
});
```

You can run `grunt` to rebuild the client sdk, which will produce a new javascript and stylesheet in the `build/` directory. Both minified and full versions.

# What is Quizlet
Quizlet is really two pieces, so we'll cover them individually.

## Middleware
The middleware is an Express route middleware that provides the backend for the client-side sdk; and manages the data in the database.  It uses a MySQL database and SequelizeJS to access the data.