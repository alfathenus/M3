'use strict';

// Empties folders to start fresh
module.exports = {
	dist   : {
		files : [
			{
				dot : true,
				src : [
					'.tmp'
				]
			}
		]
	},
	server : '.tmp'
};