import CustomAttributeRegistry from 'custom-attributes/registry';
import { MakeRelativePathAttr, MakeAbsolutePathAttr } from './helpers/attr';
import { RELATIVE_ATTR, ABSOLUTE_ATTR } from './helpers/constants';
import { normalizePathPiece } from './helpers/utils';
import PathNode from './helpers/path-node';

window.SimplaPaths = {
  observe(root, rootId = '') {
    const registry = new CustomAttributeRegistry(root),
          rootNode = new PathNode(),
          firstThatExists = (exists) => !!exists,
          toAttrInstance = element => attr => registry.get(element, attr),
          getNode = (element) => [ ABSOLUTE_ATTR, RELATIVE_ATTR ].map(toAttrInstance(element)).find(firstThatExists);

    rootNode.partial = normalizePathPiece(rootId);

    registry.define(RELATIVE_ATTR, MakeRelativePathAttr(getNode, rootNode));
    registry.define(ABSOLUTE_ATTR, MakeAbsolutePathAttr(getNode, rootNode));
  }
};

window.SimplaPaths.observe(document);
