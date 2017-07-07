/* eslint-env browser, jest */

import { mapStr, addStrMap, mapStrFactory } from '../index';


test('should throws if invalid format of namespace', () => {
  expect(() => {
    mapStr();
  }).toThrow();
  expect(() => {
    mapStr('');
  }).toThrow();
  expect(() => {
    mapStr(' param ');
  }).toThrow();
  expect(() => {
    mapStr('param pam pam');
  }).toThrow();
});

test('should throws if invalid format of key', () => {
  expect(() => {
    mapStr('some');
  }).toThrow();
  expect(() => {
    mapStr('some', []);
  }).toThrow();
  expect(() => {
    mapStr('some', 'param pam pam');
  }).toThrow();
});

test('should throws if invalid format values', () => {
  expect(() => {
    addStrMap('some3', []);
  }).toThrow();

  expect(() => {
    addStrMap('some4', {
      'foo': {}
    });
  }).toThrow();
});

test('should throws if namespace has already defined', () => {
  addStrMap('some1', {
    'hello': 'world'
  });

  expect(() => {
    addStrMap('some1', {
      'foo': 'bar'
    });
  }).toThrow();
});

test('should throws if fallback is invalid', () => {
  expect(() => {
    addStrMap('some4', {
      'hello': 'world'
    }, {});
  }).toThrow();
});

test('should transform fallback string to function', () => {
  addStrMap('some5', {
    'hello': 'world'
  }, 'default');

  expect(mapStr('some5', 'foo')).toBe('default');
});

test('should translate with factory', () => {
  addStrMap('some6', {
    'hello': 'world'
  }, 'default');

  const mapper = mapStrFactory('some6');

  expect(mapper('some5', 'foo')).toBe('default');
});

test('should throws if namespace is undefined in factory', () => {
  expect(() => {
    mapStrFactory('undefined');
  }).toThrow();
});

test('should translate', () => {
  addStrMap('some2', {
    'hello': 'world',
    'with params': 'with params {%param%}'
  });

  expect(mapStr('some2', 'hello')).toBe('world');
  expect(mapStr('some2', 'hello')).toBe('world'); //second time

  expect(() => {
    mapStr('some2', 'default');
  }).toThrow();

  expect(() => {
    mapStr('some2', 'with params', {});
  }).toThrow();


  expect(mapStr('some2', 'with params', { param: 3 })).toBe('with params 3'); //second time
});
