import { memo, isNumber, isString, isPlainObject, isFunction, throwHiddenError, assertRegExp, assertTrimmedNonEmptyString } from './utils';

const allMaps = {};

const defaultFallback = (namespace) => (key, params) => {
  throwHiddenError(`Invalid strMap for "${namespace}[${key}]"`);

  return '';
};

const dehydrateParams = (string, params) =>
  String(string).replace(/\{%\s*([^}]+)\s*%}/g, ($0, name) => {
    if (!params || !params.hasOwnProperty(name)) {
      throwHiddenError(`strMap param "${name}" is undefined`);
      return '';
    }

    return params[name];
  });

const checkNamespace = (namespace) => {
  if (process.env.NODE_ENV !== 'production') {
    assertRegExp(/^[a-zA-Z0-9$_]+$/, 'namespace', namespace);
  }
};

const checkKey = (key) => {
  if (process.env.NODE_ENV !== 'production') {
    if (key !== null && !isString(key) && !isNumber(key)) {
      throw new Error('strMap key must be string or number');
    }
  }
};

export const addStrMap = (namespace, values, fallback = defaultFallback(namespace)) => {
  checkNamespace(namespace);

  if (!isPlainObject(values)) {
    throw new TypeError(`value of translation "${namespace}" has invalid type. must be plainObject`);
  }

  if (isString(fallback) || isNumber(fallback)) {
    const fallbackValue = fallback;

    fallback = (key, params) => fallbackValue;
  }

  if (process.env.NODE_ENV !== 'production') {
    if (allMaps.hasOwnProperty(namespace)) {
      throw new ReferenceError(`namespace "${namespace}" has already defined`);
    }

    if (Object.values(values).filter((value) => !isString(value) && !isFunction(value) && !isNumber(value)).length) {
      throw new TypeError(`invalid value type of translation "${namespace}". must be number or string.`);
    }

    if (!isFunction(fallback)) {
      throw TypeError('invalid fallback type. must be function');
    }
  }

  allMaps[namespace] = (key, params, defaults = fallback) => {
    const value = values.hasOwnProperty(key) ? values[key] : defaults(key, params);

    if (isFunction(value)) {
      return value(params, key);
    }

    return dehydrateParams(value, params);
  };

  return namespace;
};


const _mapStr = (namespace, key = null, params = null) => {
  checkNamespace(namespace);
  checkKey(key);

  if (allMaps.hasOwnProperty(namespace)) {
    return allMaps[namespace](key, params);
  }

  throwHiddenError(`there is no strMap for "${namespace}"`);

  return '';
};


export const mapStr = memo(_mapStr, (namespace, key, params = null) => `${namespace}::${key}::${params === null ? 'null' : JSON.stringify(params)}`);

export const mapStrFactory = (namespace) => {
  checkNamespace(namespace);

  if (!allMaps.hasOwnProperty(namespace)) {
    throw new Error(`there is no strMap for "${namespace}"`);
  }

  return (key, params) => mapStr(namespace, key, params);
};
