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
    stderrReturnValue,
    stdoutReturnValue,
    streamToObservableReturnValueFirst,
    streamToObservableReturnValueSecond;

beforeEach(() => {
    stderrReturnValue = chance.string();
    stdoutReturnValue = chance.string();
    execaReturnValue = chance.object({
        stderr: {
            pipe: jest.fn(() => stderrReturnValue)
        },
        stdout: {
            pipe: jest.fn(() => stdoutReturnValue)
        }
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
    it('should be called with command and arguments', () => {
        const cmd = chance.string();
        const args = chance.string();

        execao(cmd, args);

        expect(execa).toHaveBeenCalledTimes(1);
        expect(execa).toHaveBeenCalledWith(cmd, args);
    });
});

describe('execa return value', () => {
    it('should call stdout pipe with split', () => {
        execao();

        expect(execaReturnValue.stdout.pipe).toHaveBeenCalledTimes(1);
        expect(execaReturnValue.stdout.pipe).toHaveBeenCalledWith(splitReturnValueFirst);
    });

    it('should call stderr pipe with split', () => {
        execao();

        expect(execaReturnValue.stderr.pipe).toHaveBeenCalledTimes(1);
        expect(execaReturnValue.stderr.pipe).toHaveBeenCalledWith(splitReturnValueSecond);
    });
});

describe('streamToObservable', () => {
    it('should be called with execa pipes and options', () => {
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
    it('should be called for each observable', () => {
        execao();

        expect(split).toHaveBeenCalledTimes(2);
        expect(split).toHaveBeenCalledWith();
    });
});

describe('filter', () => {
    it('should be called with boolean', () => {
        execao();

        expect(rxjsOperators.filter).toHaveBeenCalledTimes(1);
        expect(rxjsOperators.filter).toHaveBeenCalledWith(Boolean);
    });
});

describe('merge', () => {
    it('should be called with observables', () => {
        execao();

        expect(rxjs.merge).toHaveBeenCalledTimes(1);
        expect(rxjs.merge).toHaveBeenCalledWith(streamToObservableReturnValueFirst, streamToObservableReturnValueSecond);
    });

    it('should call pipe with filter value', () => {
        execao();

        expect(mergeReturnValue.pipe).toHaveBeenCalledTimes(1);
        expect(mergeReturnValue.pipe).toHaveBeenCalledWith(filterReturnValue);
    });

    it('should return merge pipe results', () => {
        const results = execao();

        expect(results).toEqual(mergePipeReturnValue);
    });
});
