// types
export const isNumber = (value) => typeof value === 'number';

export const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

export const isFunction = (value) => typeof value === 'function';

export const isString = (value) => typeof value === 'string';


// utils
export const memo = (func, mem = (first) => String(first)) => {
  const cache = {};

  return (...args) => {
    const key = mem(...args);

    if (!cache.hasOwnProperty(key)) {
      cache[key] = func(...args);
    }

    return cache[key];
  };
};


// errors
export const throwHiddenError = (message) => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(message);
  }

  window.console && console.error && console.error(message); // eslint-disable-line
};


// asserts
export const assertRegExp = (exp, name, value) => {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be string`);
  }

  if (!exp.test(value)) {
    throw new Error(`${name} "${value}" has invalid format`);
  }
};
