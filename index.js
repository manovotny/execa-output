const streamToObservable = require('@samverschueren/stream-to-observable');
const execa = require('execa');
const {merge} = require('rxjs');
const {filter} = require('rxjs/operators');
const split = require('split');

module.exports = (cmd, args) => {
    const cp = execa(cmd, args);

    return merge(
        streamToObservable(cp.stdout.pipe(split()), {await: cp}),
        streamToObservable(cp.stderr.pipe(split()), {await: cp})
    ).pipe(filter(Boolean));
};
