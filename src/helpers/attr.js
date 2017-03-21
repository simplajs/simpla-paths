import PathNode from './path-node';
import { isNot } from './utils';

export const MakeRelativePathAttr = (getNode, root) => class extends PathNode {
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

  connectedCallback() {
    this.setPartialToValue();
    this.attachToParent();
  }

  disconnectedCallback() {
    this.setPartialToValue();
    this.pluck();
  }

  changedCallback() {
    this.setPartialToValue();
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

  setPartialToValue() {
    this.partial = this.value;
  }

  set path(value) {
    super.path = value;
    this.ownerElement.uid = value;
  }

  get path() {
    return super.path;
  }
}

export const MakeAbsolutePathAttr = (getNode, root) => class extends MakeRelativePathAttr(getNode, root) {
  refreshPath() {
    this.path = this.partial || ''
  }
}
