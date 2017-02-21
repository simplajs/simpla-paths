import PathNode from '../../src/path-node';

describe('PathNode', () => {
  let parent,
      child;

  beforeEach(() => {
    parent = new PathNode();
    child = new PathNode();
  });

  describe('addChild / removeChild', () => {
    it(`should add / remove the child to children property`, () => {
      parent.addChild(child);
      expect(parent.children).to.include(child);

      parent.removeChild(child);
      expect(parent.children).to.not.include(child);
    });

    it(`should set the parent property to parent / null on the child`, () => {
      parent.addChild(child);
      expect(child.parent).to.equal(parent);

      parent.removeChild(child);
      expect(child.parent).to.be.null;
    });

    it('should not add to children array if already a child', () => {
      let length;

      parent.addChild(child);
      expect(parent.children).to.include(child);

      length = parent.children.length;

      parent.addChild(child);
      expect(parent.children.length).to.equal(length);
    });
  });

  describe('path', () => {
    beforeEach(() => {
      parent.addChild(child);
    });

    it(`should be concatenation of parent's path and node partial`, () => {
      child.partial = 'baz';
      parent.path = 'foo.bar';

      expect(child.path).to.equal('foo.bar.baz');
    });

    it(`should be the parent's path if it has no partial`, () => {
      parent.path = 'foo.bar';
      expect(child.path).to.equal(parent.path);
    });

    it(`should be just its own partial if parent's path has no partial`, () => {
      child.partial = 'baz';
      expect(child.path).to.equal(child.partial);
    });

    it(`should be just its own partial if parent is null`, () => {
      parent.path = 'foo.bar';
      child.partial = 'baz';
      child.parent = null;
      expect(child.path).to.equal(child.partial);
    });
  });
});
