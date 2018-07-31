const execa = require('execa');
const rxjs = require('rxjs');
const split = require('split');

jest.mock('@samverschueren/stream-to-observable');
jest.mock('execa');
jest.mock('rxjs');
jest.mock('rxjs/operators');
jest.mock('split');

describe('execao', () => {
    let execao;

    beforeEach(() => {
        execa.mockReturnValue({
            stderr: {
                pipe: jest.fn()
            },
            stdout: {
                pipe: jest.fn()
            }
        });

        rxjs.merge.mockReturnValue({
            pipe: jest.fn()
        });

        execao = require('./index');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should be called twice', () => {
        execao();
        expect(split).toHaveBeenCalledTimes(2);
    });
});
