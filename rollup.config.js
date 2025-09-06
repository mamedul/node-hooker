import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

// Check if the NODE_ENV is 'production'
const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: './lib/Hooker.js',
  output: {
    // Dynamically set the filename
    file: isProduction ? 'dist/node-hooker.umd.min.js' : 'dist/node-hooker.umd.js',
    format: 'umd',
    name: 'Hooker', 
  },
  plugins: [
    resolve(),
    commonjs(),
    
    // Only add terser() to the plugins array if isProduction is true
    isProduction && terser()
  ]
};