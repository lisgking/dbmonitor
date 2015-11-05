/**
 * Polyfills/Normalization for Fall-back Browsers
 * @module jsm.shims
 * @example console.log performance.now
 * @example classList dataset hidden insertAdjacentElement
 */
(function(global){
	"use strict";
	var methods=["debug","error","info","log","warn","dir","dirxml","table","trace","assert","count","markTimeline",
		"profile","profileEnd","time","timeEnd","timeStamp","timeline","timelineEnd","group","groupCollapsed",
		"groupEnd","clear"];
	/**
	 * @namespace jsm.shims
	 * @class Console
	 */
	/**
	 * Writes a message to the console.
	 * You may pass as many arguments as you'd like, and they will be joined together in a space-delimited line.
	 * @method log
	 * @param {*} [object]*
	 */
	/**
	 * Writes a message to the console, including a hyperlink to the line where it was called.
	 * @method debug
	 * @param {*} [object]*
	 */
	/**
	 * Writes a message to the console with the visual "info" icon and color coding and a hyperlink to the line where it was called.
	 * @method info
	 * @param {*} [object]*
	 */
	/**
	 * Writes a message to the console with the visual "warning" icon and color coding and a hyperlink to the line where it was called.
	 * @method warn
	 * @param {*} [object]*
	 */
	/**
	 * Writes a message to the console with the visual "error" icon and color coding and a hyperlink to the line where it was called.
	 * @method error
	 * @param {*} [object]*
	 */
	/**
	 * Tests that an expression is true. If not, it will write a message to the console and throw an exception.
	 * @method assert
	 * @param {Boolean} expression
	 * @param {*} [object]*
	 */
	/**
	 * Clears the console.
	 * @method clear
	 */
	/**
	 * Prints an interactive listing of all properties of the object. This looks identical to the view that you would see in the DOM Panel.
	 * @method dir
	 * @param {Object} object
	 */
	/**
	 * Prints the XML source tree of an HTML or XML element. This looks identical to the view that you would see in the HTML Panel. You can click on any node to inspect it in the HTML Panel.
	 * @method dirxml
	 * @param {Element} node
	 */
	/**
	 * Prints an interactive stack trace of JavaScript execution at the point where it is called.
	 * @method trace
	 */
	/**
	 * Writes a message to the console and opens a nested block to indent all future messages sent to the console. Call console.groupEnd() to close the block.
	 * @method group
	 * @param {*} [object]*
	 */
	/**
	 * Like console.group(), but the block is initially collapsed.
	 * @method groupCollapsed
	 * @param {String} title
	 * @param {*} [object]*
	 */
	/**
	 * Closes the most recently opened block created by a call to console.group() or console.groupCollapsed()
	 * @method groupEnd
	 * @param {String} title
	 */
	/**
	 * Creates a new timer under the given name. Call console.timeEnd() with the same name to stop the timer and print the time elapsed.
	 * @method time
	 * @param {String} name
	 */
	/**
	 * Stops a timer created by a call to console.time(name) and writes the time elapsed.
	 * @method timeEnd
	 * @param {String} name
	 */
	/**
	 * Creates a time stamp, which can be used together with HTTP traffic timing to measure when a certain piece of code was executed.
	 * @method timeStamp
	 * @param {String} name
	 */
	/**
	 * Turns on the JavaScript profiler.
	 * @method profile
	 * @param {String} [title]
	 */
	/**
	 * Turns off the JavaScript profiler and prints its report.
	 * @method profileEnd
	 */
	/**
	 * Writes the number of times that the line of code where count was called was executed.
	 * @method count
	 * @param {String} [title]
	 */
	/**
	 * Prints an error message together with an interactive stack trace of JavaScript execution at the point where the exception occurred.
	 * @method exception
	 * @param {Error} error-object
	 * @param {*} [arg]*
	 */
	/**
	 * Allows to log provided data using tabular layout.
	 * @method table
	 * @param {Object} data
	 * @param {Number} [columns]
	 */
	function Console(){}
	
	var console=global.console,
		log;
	if(typeof console!=="object"){
		log=function log(){
			//NOOP
		};
		methods.forEach(function(name){
			Console.prototype[name]=log;
		});
		global.console=new Console();
	}else{
		log=console.log;
		methods.forEach(function(name){
			if(typeof this[name]!=="function"){
				this[name]=log;
			}
		},console);
	}
	if(typeof define==="function"&&define.amd){
		define(function(){return console;});
	}
}(this));
