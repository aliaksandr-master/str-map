/* eslint-env browser, jest */

import { mapStr, addStrMap } from '../index';


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
    mapStr('some', ' param ');
  }).toThrow();
  expect(() => {
    mapStr('some', 'param pam pam');
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
