import PathNode from './path-node';
import { isNot } from './utils';
import { PATH_PROP, ROOT_PATH, PATH_GLUE } from './constants';

export const MakeRelativePathAttr = (getNode, root) => class extends PathNode {
  connectedCallback() {
    this.attachToParent();
    this.syncValueToPartial();
    this.syncPathToOwnerElement();
  }

  disconnectedCallback() {
    this.pluck();
    this.syncValueToPartial();
    this.syncPathToOwnerElement();
  }

  changedCallback() {
    this.syncValueToPartial();
    this.syncPathToOwnerElement();
  }

  addChild(toAdd) {
    let added = super.addChild(toAdd);

    if (added) {
      this.children
        .filter(isNot(toAdd))
        .forEach(child => {
          child.attachToParent();
        });
    }
  }

  attachToParent() {
    let base,
        node;

    do {
      base = base ? base.parentElement : this.ownerElement.parentElement;
      node = getNode(base);
    } while (base && !node)

    if (node) {
      node.addChild(this);
    } else {
      root.addChild(this);
    }
  }

  syncValueToPartial() {
    this.partial = this.value;
  }

  syncPathToOwnerElement() {
    this.ownerElement[PATH_PROP] = ROOT_PATH + this.path;
    this.children.forEach(child => child.syncPathToOwnerElement());
  }
}

export const MakeAbsolutePathAttr = (getNode, root) => class extends MakeRelativePathAttr(getNode, root) {
  refreshPath() {
    this.path = this.partial || ''
  }
}
