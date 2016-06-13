const rollup = require('rollup');
const babel = require('rollup-plugin-babel');

rollup.rollup({
    entry: './index.js',
    external: [
        'marionette',
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
    ],
}).then((bundle) => {
    bundle.write({
        format: 'umd',
        globals: {
            marionette: 'Marionette',
        },
        moduleId: 'marionette-busy',
        moduleName: 'marionetteBusy',
        dest: 'dist/marionette-busy.js',
    });
}).catch((err) => {
    console.log(String(err));
    process.exit(1);
});
