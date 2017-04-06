import { isNot } from './utils';
import { PATH_GLUE } from './constants';

export default class PathNode {
  constructor() {
    this.children = [];
  }

  addChild(newChild) {
    let previousChildren;

    if (newChild.parent === this) {
      return;
    }

    previousChildren = this.children;

    this.children = [ ...previousChildren, newChild ];
    newChild.parent = this;

    // If adopting a child, the previous children may no longer be children
    //  therefore give them the opportunity to find their parent
    previousChildren.forEach(child => child.findAndAttachToParent());
  }

  removeChild(toRemove) {
    this.children = this.children
      .filter(isNot(toRemove));

    toRemove.parent = null;
  }

  refreshPath() {
    let path = [];

    if (this.parent && this.parent.path) {
      path.push(this.parent.path);
    }

    if (this.partial) {
      path.push(this.partial);
    }

    this.path = path.join(PATH_GLUE);
  }

  set path(value) {
    this._path = value;
    this.children.forEach(child => child.refreshPath());
  }

  get path() {
    return this._path;
  }

  set parent(value) {
    this._parent = value;
    this.refreshPath();
  }

  get parent() {
    return this._parent;
  }

  set partial(value) {
    this._partial = value;
    this.refreshPath();
  }

  get partial() {
    return this._partial;
  }

  pluck() {
    let parent = this.parent,
        children = this.children;

    this.parent = null;
    this.children = [];

    children.forEach(parent.addChild, parent);
  }

  /**
   * Attach child to parent. Child should automatically search for, and attach to
   *  it's appropriate parent.
   * @abstract
   * @return {undefined}
   */
  findAndAttachToParent() {}
}
