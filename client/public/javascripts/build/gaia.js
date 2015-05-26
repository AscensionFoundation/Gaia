var React = require('react'),
	mui = require('material-ui'),
	RaisedButton = mui.RaisedButton;
	TextField = mui.TextField;

var MyAwesomeReactComponent = React.createClass({displayName: "MyAwesomeReactComponent",

	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(TextField, {hintText: "Explore"}), 
				React.createElement(RaisedButton, {label: "Search"})
			)
		);
	}

});
 
React.render(
	React.createElement(MyAwesomeReactComponent, null),
	document.getElementById('example')
);