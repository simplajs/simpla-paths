import CustomAttributeRegistry from 'custom-attributes/registry';
import { MakeRelativePathAttr, MakeAbsolutePathAttr } from './helpers/attr';
import { RELATIVE_ATTR, ABSOLUTE_ATTR } from './helpers/constants';
import { normalizePathPiece, findNodeInRegistry } from './helpers/utils';

import PathNode from './helpers/path-node';

window.SimplaPaths = {
  observe(root, rootId = '') {
    const registry = new CustomAttributeRegistry(root),
          rootNode = new PathNode(),
          findNodeForAttributes = findNodeInRegistry(registry),
          getNode = findNodeForAttributes([ ABSOLUTE_ATTR, RELATIVE_ATTR ]);

    rootNode.partial = normalizePathPiece(rootId);

    registry.define(RELATIVE_ATTR, MakeRelativePathAttr(getNode, rootNode));
    registry.define(ABSOLUTE_ATTR, MakeAbsolutePathAttr(getNode, rootNode));
  }
};

window.SimplaPaths.observe(document);
