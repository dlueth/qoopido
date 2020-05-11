import configure from '../../config/rollup';
import { dependencies } from './package.json';

export default configure({
	name: '@qoopido/emitter',
	input: 'src/index.js',
	dependencies
});
