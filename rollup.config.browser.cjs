
const babel = require('@rollup/plugin-babel').default;
const image = require('@rollup/plugin-image').default;

const builds = {
	input: [ 'src/index.js'],
	output: [{
		name: 'web_player',
		file: 'dist/browser/web_player.js',
		format: 'umd'
	},
	],
	plugins: [babel({ babelHelpers: 'bundled' }),
		image({
			dom:true
		})
	]

};

module.exports = builds