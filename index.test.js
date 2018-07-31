const streamToObservable = require('@samverschueren/stream-to-observable');
const Chance = require('chance');
const execa = require('execa');
const rxjs = require('rxjs');
const rxjsOperators = require('rxjs/operators');
const split = require('split');

const execao = require('./index');

jest.mock('@samverschueren/stream-to-observable');
jest.mock('execa');
jest.mock('rxjs');
jest.mock('rxjs/operators');
jest.mock('split');

const chance = new Chance();

beforeEach(() => {
    execa.mockImplementation(() => {
        return {
            stderr: {
                pipe: jest.fn()
            },
            stdout: {
                pipe: jest.fn()
            }
        }
    });

    execao();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('split', () => {
    it('should be called twice', () => {
        expect(split).toHaveBeenCalledTimes(2);
    });
});
