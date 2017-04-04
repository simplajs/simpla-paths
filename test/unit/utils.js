import { normalizePathPiece } from '../../src/helpers/utils';

describe('utils', () => {
  describe('normalizePathPiece', () => {
    [{
      from: '/',
      to: ''
    }, {
      from: 'foo',
      to: 'foo'
    }, {
      from: '/foo',
      to: 'foo'
    }, {
      from: 'foo/',
      to: 'foo'
    }, {
      from: '//foo',
      to: 'foo'
    }, {
      from: '/foo/',
      to: 'foo'
    }, {
      from: '//foo/bar//',
      to: 'foo/bar'
    }].forEach(({ from, to }) => {
      it(`should convert '${from}' to '${to}'`, () => {
        expect(normalizePathPiece(from)).to.equal(to);
      })
    });
  });
});
