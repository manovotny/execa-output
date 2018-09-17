const streamToObservable = require('@samverschueren/stream-to-observable');
const execa = require('execa');
const {merge} = require('rxjs');
const {filter} = require('rxjs/operators');
const split = require('split');

module.exports = (cmd, args, options, callback) => {
    const cp = execa(cmd, args, options);

    console.log('HERE');
    // if (callback) {
    cp.then((result) => {
        console.log('MADE IT');
        callback(result.stdout);
    });
    // }

    return merge(
        streamToObservable(cp.stdout.pipe(split()), {await: cp}),
        streamToObservable(cp.stderr.pipe(split()), {await: cp})
    ).pipe(filter(Boolean));
};
