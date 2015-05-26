var restify = require('restify');
var mysql   = require('mysql');
var _       = require('underscore');

var server;
{
	server = restify.createServer({
	  name: 'myapp',
	  version: '1.0.0'
	});

	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.bodyParser());
}

var connection;
{
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : ''
	});

	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}

		console.log('connected as id ' + connection.threadId);
		connection.query('USE ascension', function(err, rows) {
			console.log('connected to ascension');
		});
	});
}

var one = function( res ) {

	return function ( error, results, fields ) {

		if ( error ) {

			res.status( 404 );
			res.json( { error: error } );

		} else {

			res.status( 200 );
			res.json( results[ 0 ] );

		}
	}

};


var many = function( res ) {

	return function ( error, results, fields ) {

		if ( error ) {

			res.status( 404 );
			res.json( { error: error } );

		} else {

			//console.log( fields );
			//var json = _.object( fields, results );
			//console.log(results);

			res.status( 200 );
			res.json( results );

		}
	}

};


// Server
{
	// list all databases
	server.get( 'sql/database', function ( req, res, next ) {

		connection.query({
			sql: 'SELECT database() AS database_name'
		}, many( res ) );

	});

	// list all tables
	server.get( 'sql/tables', function ( req, res, next ) {

		connection.query({
			sql: 'SHOW TABLES',
			values: [ ],
		}, many( res ) );

	});

	// list all columns
	server.get( 'sql/columns/:table', function ( req, res, next ) {

		var table = req.params.table;

		connection.query({
			sql: 'SHOW COLUMNS FROM index_country',
			values: [ table ],
		}, many( res ) );

	});

	// dump a database
	server.get( 'sql/dump/:table', function ( req, res, next ) {

		var table = req.params.table;

		connection.query({
			sql: 'SELECT * FROM ' + table + ' LIMIT 10',
			values: [ table ],
		}, many( res ) );

	});
}

// Cities
{

	// city complete
	server.get( 'geo/countries/s/:name', function ( req, res, next ) {

		var name = req.params.name + '%';

		connection.query({
			sql: 'SELECT name FROM ascension.index_country WHERE name LIKE ?',
			values: [ name ],
		}, many( res ) );

	});

	// city search
	server.get( 'geo/countries/en-us/:name', function ( req, res, next ) {

		var name = req.params.name;

		connection.query({
			sql: 'SELECT * FROM ascension.index_country WHERE name = ?',
			values: [ name ],
		}, one( res ) );

	});

	// city by id
	server.get( 'geo/countries/:id', function ( req, res, next ) {

		var id = req.params.id;

		connection.query({
			sql: 'SELECT * FROM ascension.index_country WHERE id = ?',
			values: [ id ],
		}, one( res ) );

	});

}


server.listen(8008, function () {
  console.log('%s listening at %s', server.name, server.url);
});