describe('<simpla-path>', () => {
  let root,
      nodes;

  [ 'sid', 'gid' ].forEach(attr => {
    describe(attr, () => {
      beforeEach(() => {
        root = fixture(attr);
        window.SimplaPaths.observe(root);
        nodes = [].slice.call(root.querySelectorAll(`[${attr}]`));
      });

      it(`should give all nodes with an ${attr} attribute a 'path' value`, () => {
        nodes.forEach((node) => {
          expect(node.path).to.exist;
        });
      });

      it('should give each node the correct path value', () => {
        nodes.forEach((node) => {
          expect(node.path).to.equal(node.getAttribute('expected-path'));
        });
      });
    });
  });

  describe('dynamic updates', () => {
    const template = `
      <div sid="fruit">
        <div sid="apples">
          <div sid="fuji"></div>
        </div>
      </div>
    `;

    function stamp() {
      root.innerHTML = template;
      return [ 'fruit', 'apples', 'fuji' ].map(attr => root.querySelector(`[sid="${attr}"]`));
    }

    beforeEach(() => {
      root = fixture('dynamic');
      window.SimplaPaths.observe(root);
    });

    describe('adding nodes', () => {
      it('should add the right path to the added node(s)', (done) => {
        let [ fruit, apples, fuji ] = stamp();

        async.nextTick(() => {
          expect(fruit.path).to.equal('/fruit');
          expect(apples.path).to.equal('/fruit/apples');
          expect(fuji.path).to.equal('/fruit/apples/fuji');
          done();
        });
      });
    });

    describe('changing attribute values', () => {
      it('should change paths when changing sids', (done) => {
        let [, apples, fuji ] = stamp();

        apples.setAttribute('sid', 'pears');

        async.nextTick(() => {
          expect(fuji.path).to.equal('/fruit/pears/fuji')
          done();
        });
      });
    });

    describe('removing / adding attributes', () => {
      it('should update path paths correctly on remove / adding', (done) => {
        let [, apples, fuji ] = stamp();

        apples.removeAttribute('sid');

        async.nextTick(() => {
          expect(fuji.path).to.equal('/fruit/fuji');
          apples.setAttribute('sid', 'apples');

          async.nextTick(() => {
            expect(fuji.path).to.equal('/fruit/apples/fuji');
            done();
          });
        });
      });
    });

    describe('path-changed event', () => {
      it('should fire a path-changed event with the path as value', (done) => {
        let [ fruit, apples ] = stamp(),
            spy = sinon.spy();

        apples.addEventListener('path-changed', spy);
        fruit.setAttribute('sid', 'vegetables');

        async.nextTick(() => {
          expect(spy.called, 'Fired event').to.be.true;
          expect(spy.lastCall.args[0].detail.value, 'Event path as detail.value').to.equal('/vegetables/apples');
          done();
        });
      });
    });
  });

  describe('Setting paths on pass', () => {
    let pathTester;

    beforeEach(() => {
      let root = fixture('path-resolution');
      window.SimplaPaths.observe(root);
      pathTester = root.querySelector('path-tester');
    });

    it('should not set path more than once as path is built', () => {
      expect(pathTester.pathHistory).to.deep.equal([
        pathTester.getAttribute('expected-path')
      ]);
    });
  });
});
