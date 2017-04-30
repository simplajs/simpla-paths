import { PATH_GLUE } from './constants';

const NORMALIZING_REGEXP = new RegExp(`^\\${PATH_GLUE}*(.+?)\\${PATH_GLUE}*$`);

export const isNot = banned => item => item !== banned
export const normalizePathPiece = (piece) => {
  // TODO: Be nice in future to merge this into the above regexp
  if (piece === PATH_GLUE) {
    return '';
  }

  return piece
    .replace(NORMALIZING_REGEXP, '$1');
}

export const findNodeInRegistry = registry => attributes => element => {
  for (let i = 0, k = attributes.length; i < k; i++) {
    let instance = registry.get(element, attributes[i]);

    if (instance) {
      return instance;
    }
  }

  return null;
}
