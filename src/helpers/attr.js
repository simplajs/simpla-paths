import PathNode from './path-node';
import { PATH_PROP, ROOT_PATH } from './constants';

export const MakeRelativePathAttr = (getNode, root) => class extends PathNode {
  connectedCallback() {
    this.findAndAttachToParent();
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

  findAndAttachToParent() {
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
    let path = ROOT_PATH + this.path,
        pathChangedEvent = new CustomEvent('path-changed', { detail: { value: path } });

    this.ownerElement[PATH_PROP] = path;
    this.ownerElement.dispatchEvent(pathChangedEvent)
    this.children.forEach(child => child.syncPathToOwnerElement());
  }
}

export const MakeAbsolutePathAttr = (getNode, root) => class extends MakeRelativePathAttr(getNode, root) {
  refreshPath() {
    this.path = this.partial || ''
  }
}
