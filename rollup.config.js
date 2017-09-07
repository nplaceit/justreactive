export default {
    input: 'src/index.js',
    indent: '\t',
    plugins: [],
    output: [
        {
            format: 'umd',
            name: 'Reactive',
            file: `build/reactive.js`
        },
        {
            format: 'es',
            file: 'build/reactive.module.js'
        }
    ]
};