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
### Configuration
There is a configuration file `config.js` in the main repository.  You can use this to configure access to the database and the administrator password and key.

```javascript
module.exports = {
    database: {
        dbname:"quizlet",
        username:"admin",
        password: "DUMMY"
    },
    admin_password: "sumome",
    admin_key: "dc0fc10aaa7ee06bc67a004941841b41"  // random signing key
};
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

```html
<head>
    <link rel="stylesheet" href="quizlet.min.css" type="text/css"/>
</head>
<body>
    <!-- other stuff on your page -->
    <script type="text/javascript" src="quizlet.js"></script>
</body>
```
Then, kick everything off by calling the `.init()` method.  You can configure quizlet by passing in a configuration object to the `.init()` method.  Currently the only config is the endpoint url for backend XHR calls.

```javascript
var quizlet = require('./quizlet.js');

// Kick off Quizlet running....
quizlet.init({
    url: config.url
});
```

You can run `grunt` to rebuild the client sdk and local test server, which will produce a new javascript and stylesheet in the `build/` directory. Both minified and full versions.
To test locally, you can simply run `node server.js` on the command line and then navigate your browser to `http://localhost:8181/`.

**Note**:  When you add a poll currently in the admin UI, the 'Polls' tab will not update to reflect the addition.  You'll need to close the Admin UI and reopen to see your new poll show up.  It will however show up in the rotation for visitors to the site.

**Note 2**: Currently, when logged in as administrator, you are still asked to answer polls. This should be corrected in a future version.

Once there, you'll be prompted to answer a poll (there are two dummy polls in the database). Once you answer the poll, you can login as admin by typing `quizlet↑` which will prompt you for the administrator password (the default is `sumome`).  

<center>
<img src="/img/quizlet-interface-poll-display.png?raw=true" width="200" />
</center>

Once you login, you'll see the admin interface which consists of two tabs.

1. **Poll Results** - show the current results of voting on all available polls. You can expand/collapse each one and scroll through them.
2. **'+' (Add Poll)** - this is where you add new polls.

<center>
<img src="/img/quilet-interface-poll-results.png?raw=true" width="200"/>

<img src="/img/quilet-interface-poll-entry.png?raw=true" width="200" />
</center>

# What is Quizlet
Quizlet is really two pieces, so we'll cover them individually.

## Middleware
The middleware is an Express route middleware that provides the backend for the client-side sdk; and manages the data in the database.  It uses a MySQL database and SequelizeJS to access the data.

`TODO`: Add more information, screenshots for the quizlet interface.  Put together a list of milestones and fixes that need to be made.
