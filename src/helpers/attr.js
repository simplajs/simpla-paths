import PathNode from './path-node';
import { isNot } from './utils';

export const MakeRelativePathAttr = (getNode, root) => class extends PathNode {
  connectedCallback() {
    this.attachToParent();
    this.syncValueToPartial();
    this.syncPathToUid();
  }

  disconnectedCallback() {
    this.pluck();
    this.syncValueToPartial();
    this.syncPathToUid();
  }

  changedCallback() {
    this.syncValueToPartial();
    this.syncPathToUid();
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

  syncPathToUid() {
    this.ownerElement.uid = this.path;
    this.children.forEach(child => child.syncPathToUid());
  }
}

export const MakeAbsolutePathAttr = (getNode, root) => class extends MakeRelativePathAttr(getNode, root) {
  refreshPath() {
    this.path = this.partial || ''
  }
}
