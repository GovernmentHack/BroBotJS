const { configure } = require('enzyme')
const chai = require('chai')
const Adapter = require('enzyme-adapter-react-16')
const { JSDOM } = require('jsdom')
const expect = chai.expect
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

configure({ adapter: new Adapter() });

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);