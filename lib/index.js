var IS_NODE_ENV = typeof process != 'undefined';
var IS_CHROME_ENV = typeof chrome != 'undefined';
var IS_MOZILLA_ENV = typeof Components != 'undefined';

/**
 * @type {'x-logger'}
 */
var defaultSymbolKeyPrefix = 'x-logger';
var trimPolyfillReplaceRegExp = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

if (!String.prototype.trim) {
  String.prototype.trim = function trimPolyfill() {
    return this.replace(trimPolyfillReplaceRegExp, '');
  };
}

if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = function setPrototypeOf(target, source) {
    target.__proto__ = source;
  };
}

if (!Object.getPrototypeOf) {
  Object.getPrototypeOf = function getPrototypeOf(source) {
    return source.__proto__;
  };
}

function isNullOrUndefined(value) { return value === null || value === undefined; }
function isNullOrEmpty(value) { return value === null || value === undefined || value === ''; }
/**
 * 
 * @param {string | undefined | null} value 
 * @returns {boolean}
 */
function isNullOrWhiteSpace(value) { return value === null || value === undefined || String(value).trim() === ''; }

function XLoggerError() {
  var _xlogger_error_self;

  if (this instanceof Error) {
    _xlogger_error_self = this;
  } else {
    _xlogger_error_self = Object.create(XLoggerError.prototype);
  }

  var _xlogger_error_this = Error.call(null, arguments[0]);
  var _xlogger_error_name = arguments[1];
  var _xlogger_error_name_length = (_xlogger_error_name || "").length;
  _xlogger_error_this.name = (
    !!_xlogger_error_name
    && typeof _xlogger_error_name === 'string'
    && _xlogger_error_name.substring(0, 7) === 'XLogger'
    && _xlogger_error_name.substring(_xlogger_error_name_length - 5, _xlogger_error_name_length) === 'Error'
    && _xlogger_error_name
  ) || XLoggerError.prototype.name;

  Object.setPrototypeOf(_xlogger_error_this, Object.getPrototypeOf(_xlogger_error_self));

  if (Error.captureStackTrace) {
    Error.captureStackTrace(_xlogger_error_this, XLoggerError);
  } else if (IS_CHROME_ENV || IS_NODE_ENV) {
    _xlogger_error_this.stack = _xlogger_error_this.stack.replace(/\n[^\n]*/, '');
  } else { } /*else if(IS_MOZILLA_ENV) {
    TODO
  } */

  return _xlogger_error_this;
}

XLoggerError.prototype = Object.create(Error.prototype,
  {
    name: {
      value: 'XLoggerError',
      writable: true,
      enumerable: false,
      configurable: true
    },
    message: {
      value: '',
      writable: true,
      enumerable: false,
      configurable: true
    },
    constructor: {
      value: XLoggerError,
      writable: false,
      enumerable: false,
      configurable: true
    }
  }
);

Object.setPrototypeOf(XLoggerError, Error);

/**
 * 
 * @param {string} string 
 * @param {string | undefined} prefix 
 */
function makeSymbolKey(string, prefix) {
  if (isNullOrWhiteSpace(value)) throw new Error();

  var usePrefix = defaultSymbolKeyPrefix;
  if (isNullOrWhiteSpace(prefix)) {
    usePrefix = prefix;
  }


}

const CustomSymbolPrefixSymbol = Symbol.for();
const HasObjectFreezeSymbol = Symbol.for();
const HasConsoleLogSymbol = Symbol.for();

/**
 * @typedef {('verbose' | 'info' | 'warn' | 'error' | 'silent')} XLoggerType
 */

/**
 * @readonly
 * @enum {0 | 1 | 2 | 3 | 4}
 */
const XLoggerTypeEnum = {
  /**
   * @type {0}
   */
  SILENT: 0,
  /**
   * @type {1}
   */
  ERROR: 1,
  /**
   * @type {2}
   */
  WARN: 2,
  /**
   * @type {3}
   */
  INFO: 3,
  /**
   * @type {4}
   */
  VERBOSE: 4
};

/**
 * @enum {1 | 2 | 3 | 4}
 */
const XLoggerLogLevelEnum = {
  /**
   * @type {1}
   */
  ERROR: 1,
  /**
   * @type {2}
   */
  WARN: 2,
  /**
   * @type {1}
   */
  LOG: 1,
  /**
   * @type {1}
   */
  INFO: 1
};

/**
 * @typedef XLoggerOptions
 * @property {boolean | undefined} logDateTime
 * @property {boolean | undefined} logTraceOnErrors
 * @property {boolean | undefined} logTraceOnWarnings
 * @property {boolean | undefined} useStyleParser
 * @property {boolean | undefined} useAltMethods
 * @property {XLoggerLogLevelEnum} logLevel
 */

/**
 * 
 * @param {(XLoggerOptions | XLoggerType)} options 
 * @param {*} useStyleParser 
 */
function XLogger(options, useStyleParser) {

}