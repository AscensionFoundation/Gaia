var React = require('react'),
	mui = require('material-ui'),
	RaisedButton = mui.RaisedButton;
	TextField = mui.TextField;

var MyAwesomeReactComponent = React.createClass({

	render: function() {
		return (
			<div>
				<TextField hintText="Explore" />
				<RaisedButton label="Search" />
			</div>
		);
	}

});
 
React.render(
	<MyAwesomeReactComponent />,
	document.getElementById('example')
);