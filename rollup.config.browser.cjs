
const babel = require('@rollup/plugin-babel').default;

const builds = {
	input: [ 'src/index.js'],
	output: [{
		name: 'web_player',
		file: 'dist/browser/web_player.js',
		format: 'umd'
	},
	],
	plugins: [babel({ babelHelpers: 'bundled' })]

};

module.exports = builds