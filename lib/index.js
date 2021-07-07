///////////////////////// -- ENV -- /////////////////////////

var IS_NODE_ENV = typeof process != 'undefined';
var IS_CHROME_ENV = typeof chrome != 'undefined';
var IS_MOZILLA_ENV = typeof Components != 'undefined';

/////////////////////////////////////////////////////////////

/**
 * @type {'x-logger'}
 */
var defaultSymbolKeyPrefix = 'x-logger';

///////////////////////// -- POLYFILLS -- /////////////////////////

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

/////////////////////////////////////////////////////////////////

///////////////////////// -- HELPERS -- /////////////////////////

function isNullOrUndefined(value) { return value === null || value === undefined; }
function isNullOrEmpty(value) { return value === null || value === undefined || value === ''; }
/**
 * 
 * @param {string | undefined | null} value 
 * @returns {boolean}
 */
function isNullOrWhiteSpace(value) { return value === null || value === undefined || String(value).trim() === ''; }

var _contains_non_word_char_regex = /\W/;

/**
 * 
 * @param {string | number | symbol} methodName The method name, A property key
 * @param {string} errorMessage The Error Message
 * @param {never} thisArg thisArg Is Symbolic For Console To Represent A Bindable Usage
 */
function IncorrectMethodUsage(methodName, errorMessage, thisArg = null) {
  var _incorrect_method_usage_this_name;
  var _incorrect_method_usage_method_name;

  // USE XLoggerError.ArgumentError!
  if(typeof errorMessage !== 'string') throw new XLoggerError("argument 'errorMessage' in 'IncorrectMethodUsage' must be a string but found type was " + typeof errorMessage + '.' );
  
  if (typeof this === 'function') {
    if (this.name !== '') { _incorrect_method_usage_this_name = this.name; }
    else { _incorrect_method_usage_this_name = "Function"; }
  } else {
    if(this.constructor) { _incorrect_method_usage_this_name = this.constructor.name; }
    else { _incorrect_method_usage_this_name = 'UNKNOWN'; }
  }

  if(typeof methodName === 'symbol') {
    _incorrect_method_usage_method_name = '[' + methodName.toString() + ']';
  } else if(typeof methodName === 'number' || _contains_non_word_char_regex.test(methodName)) {
    _incorrect_method_usage_method_name = '[' + methodName + ']';
  } else {
    _incorrect_method_usage_method_name = '.' + methodName;
  }

  return _incorrect_method_usage_this_name + _incorrect_method_usage_method_name + ' ' + errorMessage;
}

////////////////////////////////////////////////////////////////

///////////////////////// -- XLOGGERERROR -- /////////////////////////

function RemoveFirstStack(errorObject) {
  errorObject.stack = errorObject.stack.replace(/\n[^\n]*/, '');
}

/**
 * 
 * @returns XLoggerError
 */
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
    RemoveFirstStack(_xlogger_error_this);
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

function XLoggerErrorCustomName(name) {
  return 'XLogger' + name + 'Error';
}

XLoggerError.SyntaxError = function SyntaxError() {
  if (this !== XLoggerError) throw XLoggerError.SyntaxError(IncorrectMethodUsage.call(XLoggerError, 'SyntaxError', 'can\'t call \'SyntaxError\' with the \'new\' operator.'));

  var _xlogger_error_syntax_error = new XLoggerError(arguments[0], XLoggerErrorCustomName('Syntax'));
  
  if(IS_CHROME_ENV || IS_NODE_ENV) {
    RemoveFirstStack(_xlogger_error_syntax_error);
  }

  return _xlogger_error_syntax_error;
};

/////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {string} string 
 * @param {string | undefined} prefix 
 */
function makeSymbolKey(string, prefix) {
  if (isNullOrWhiteSpace(value)) throw new XLoggerError();

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
