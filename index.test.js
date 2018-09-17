const streamToObservable = require('@samverschueren/stream-to-observable');
const Chance = require('chance');
const object = require('chance-object');
const execa = require('execa');
const rxjs = require('rxjs');
const rxjsOperators = require('rxjs/operators');
const split = require('split');

jest.mock('@samverschueren/stream-to-observable');
jest.mock('execa');
jest.mock('rxjs');
jest.mock('rxjs/operators');
jest.mock('split');

const chance = new Chance();

chance.mixin({
    object
});

let execao,
    execaReturnValue,
    filterReturnValue,
    mergeReturnValue,
    mergePipeReturnValue,
    splitReturnValueFirst,
    splitReturnValueSecond,
    resultValue,
    stderrReturnValue,
    stdoutReturnValue,
    streamToObservableReturnValueFirst,
    streamToObservableReturnValueSecond;

beforeEach(() => {
    resultValue = chance.object({
        stdout: chance.string()
    });
    stdoutReturnValue = chance.string();
    stdoutReturnValue = chance.string();
    execaReturnValue = chance.object({
        stderr: {
            pipe: jest.fn(() => stderrReturnValue)
        },
        stdout: {
            pipe: jest.fn(() => stdoutReturnValue)
        }
        // then: jest.fn(() => {
        //     console.log('IN TEST');
        //     return resultValue;
        // })
    });
    filterReturnValue = chance.string();
    splitReturnValueFirst = chance.string();
    splitReturnValueSecond = chance.string();
    streamToObservableReturnValueFirst = chance.string();
    streamToObservableReturnValueSecond = chance.string();
    mergePipeReturnValue = chance.string();
    mergeReturnValue = chance.object({
        pipe: jest.fn(() => mergePipeReturnValue)
    });

    execa.mockReturnValue(execaReturnValue);

    rxjs.merge.mockReturnValue(mergeReturnValue);

    rxjsOperators.filter.mockReturnValue(filterReturnValue);

    streamToObservable
        .mockReturnValueOnce(streamToObservableReturnValueFirst)
        .mockReturnValueOnce(streamToObservableReturnValueSecond);

    split
        .mockReturnValueOnce(splitReturnValueFirst)
        .mockReturnValueOnce(splitReturnValueSecond);

    execao = require('./index');
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('execa', () => {
    test('should be called with command and arguments', () => {
        const cmd = chance.string();
        const args = chance.string();
        const options = chance.string();

        execao(cmd, args, options);

        expect(execa).toHaveBeenCalledTimes(1);
        expect(execa).toHaveBeenCalledWith(cmd, args, options);
    });
});

describe('execa return value', () => {
    test('should call stdout pipe with split', () => {
        execao();

        expect(execaReturnValue.stdout.pipe).toHaveBeenCalledTimes(1);
        expect(execaReturnValue.stdout.pipe).toHaveBeenCalledWith(
            splitReturnValueFirst
        );
    });

    test('should call stderr pipe with split', () => {
        execao();

        expect(execaReturnValue.stderr.pipe).toHaveBeenCalledTimes(1);
        expect(execaReturnValue.stderr.pipe).toHaveBeenCalledWith(
            splitReturnValueSecond
        );
    });
});

describe('streamToObservable', () => {
    test('should be called with execa pipes and options', () => {
        const options = {
            await: execaReturnValue
        };

        execao();

        expect(streamToObservable).toHaveBeenCalledTimes(2);
        expect(streamToObservable.mock.calls[0][0]).toEqual(stdoutReturnValue);
        expect(streamToObservable.mock.calls[0][1]).toEqual(options);
        expect(streamToObservable.mock.calls[1][0]).toEqual(stderrReturnValue);
        expect(streamToObservable.mock.calls[1][1]).toEqual(options);
    });
});

describe('split', () => {
    test('should be called for each observable', () => {
        execao();

        expect(split).toHaveBeenCalledTimes(2);
        expect(split).toHaveBeenCalledWith();
    });
});

describe('filter', () => {
    test('should be called with boolean', () => {
        execao();

        expect(rxjsOperators.filter).toHaveBeenCalledTimes(1);
        expect(rxjsOperators.filter).toHaveBeenCalledWith(Boolean);
    });
});

describe('merge', () => {
    test('should be called with observables', () => {
        execao();

        expect(rxjs.merge).toHaveBeenCalledTimes(1);
        expect(rxjs.merge).toHaveBeenCalledWith(
            streamToObservableReturnValueFirst,
            streamToObservableReturnValueSecond
        );
    });

    test('should call pipe with filter value', () => {
        execao();

        expect(mergeReturnValue.pipe).toHaveBeenCalledTimes(1);
        expect(mergeReturnValue.pipe).toHaveBeenCalledWith(filterReturnValue);
    });

    test('should return merge pipe results', () => {
        const results = execao();

        expect(results).toEqual(mergePipeReturnValue);
    });
});

describe('callback', () => {
    test('should not throw an error when a callback is not provided', () => {
        execao();
    });

    test.only('should call callback when provided', async () => {
        const callback = jest.fn();

        execao(null, null, null, callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(resultValue.stdout);
    });
});
