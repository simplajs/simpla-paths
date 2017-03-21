import CustomAttributeRegistry from 'custom-attributes/registry';
import { MakeRelativePathAttr, MakeAbsolutePathAttr } from './helpers/attr';
import PathNode from './helpers/path-node';

window.SimplaPaths = {
  observe(root, rootId = '') {
    const registry = new CustomAttributeRegistry(root),
          rootNode = new PathNode(),
          firstThatExists = (exists) => !!exists,
          toAttrInstance = element => attr => registry.get(element, attr),
          getNode = (element) => [ 'gid', 'sid' ].map(toAttrInstance(element)).find(firstThatExists);

    rootNode.partial = rootId;

    registry.define('sid', MakeRelativePathAttr(getNode, rootNode));
    registry.define('gid', MakeAbsolutePathAttr(getNode, rootNode));
  }
};

window.SimplaPaths.observe(document);