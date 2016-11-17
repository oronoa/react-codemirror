var React = require('react');
var ReactDOM = require('react-dom');
var Codemirror = require('../../src/Codemirror');

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');

var defaults = {
	markdown: '# Heading\n\nSome **bold** and _italic_ text\nBy [Jed Watson](https://github.com/JedWatson)',
	javascript: 'var component = {\n\tname: "react-codemirror",\n\tauthor: "Jed Watson",\n\trepo: "https://github.com/JedWatson/react-codemirror"\n};'
};

var App = React.createClass({
	getInitialState () {
		return {
			code: defaults.markdown,
			readOnly: false,
			activeLine : 1,
			cursorCords : null,
			mode: 'markdown',
		};
	},
	focusChanged(focus) {
		console.log(focus,'focus');
	},	
	cursorActivity(cursor, cords) {
		this.setState({
			cursorCords : cords,
			activeLine : cursor.line
		})
		console.log('ccccc',cords);
	},
	updateCode (newCode) {
		this.setState({
			code: newCode
		});
	}, 
	changeMode (e) {
		var mode = e.target.value;
		this.setState({
			mode: mode,
			code: defaults[mode]
		});
	},
	toggleReadOnly () {
		var cm = this.refs.editor.getCodeMirror();
		cm.replaceRange("new string\nfdsfssfs\t\n\t\tsfsfsf\n", { line:2,ch:0} );
		this.setState({
			readOnly: !this.state.readOnly
		}, () => this.refs.editor.focus());
	},
	interact (cm) {  
		console.log(cm.getValue());
	},
	render () {
		var options = {
			lineNumbers: true,
			readOnly: this.state.readOnly,
			mode: this.state.mode
		};
		var sideToolbarOffsetTop; 
		if (this.state.cursorCords) sideToolbarOffsetTop = this.state.cursorCords.top;
		return (
			<div className='editor' id="richEditor">
				<span style={{ top: sideToolbarOffsetTop }} className='side-toolbar'>Active Line : { this.state.activeLine } </span>
				<Codemirror
					ref="editor" 
					value={this.state.code} 
					onChange={this.updateCode}
					onScroll={this.scrollChanged}
					onCursorActivity={this.cursorActivity}
					onFocusChange={this.focusChanged} 
					options={options} 
					interact={this.interact} 
					preserveScrollPosition={true} 
				/>
				<div style={{ marginTop: 10 }}>
					<select onChange={this.changeMode} value={this.state.mode}>
						<option value="markdown">Markdown</option>
						<option value="javascript">JavaScript</option>
					</select>
					<button onClick={this.toggleReadOnly}>Toggle read-only mode (currently {this.state.readOnly ? 'on' : 'off'})</button>
				</div>
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
