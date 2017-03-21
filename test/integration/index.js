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

      it(`should give all nodes with an ${attr} attribute a 'uid' value`, () => {
        nodes.forEach((node) => {
          expect(node.uid).to.exist;
        });
      });

      it('should give each node the correct uid value', () => {
        nodes.forEach((node) => {
          expect(node.uid).to.equal(node.getAttribute('expected-uid'));
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
      it('should add the right uid to the added node(s)', (done) => {
        let [ fruit, apples, fuji ] = stamp();

        async.nextTick(() => {
          expect(fruit.uid).to.equal('fruit');
          expect(apples.uid).to.equal('fruit.apples');
          expect(fuji.uid).to.equal('fruit.apples.fuji');
          done();
        });
      });
    });

    describe('changing attribute values', () => {
      it('should change uids when changing sids', (done) => {
        let [, apples, fuji ] = stamp();

        apples.setAttribute('sid', 'pears');

        async.nextTick(() => {
          expect(fuji.uid).to.equal('fruit.pears.fuji')
          done();
        });
      });
    });

    describe('removing / adding attributes', () => {
      it('should update uid paths correctly on remove / adding', (done) => {
        let [, apples, fuji ] = stamp();

        apples.removeAttribute('sid');

        async.nextTick(() => {
          expect(fuji.uid).to.equal('fruit.fuji');
          apples.setAttribute('sid', 'apples');

          async.nextTick(() => {
            expect(fuji.uid).to.equal('fruit.apples.fuji');
            done();
          });
        });
      });
    });
  });
});
