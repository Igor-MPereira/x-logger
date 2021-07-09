///////////////////////// -- ENV -- /////////////////////////

var IS_NODE_ENV = typeof process != 'undefined';
var IS_CHROME_ENV = typeof chrome != 'undefined';
var IS_MOZILLA_ENV = typeof Components != 'undefined';

/////////////////////////////////////////////////////////////

/**
 * @type {'x-logger'}
 */
var _defaultXLoggerSymbolKeyPrefix = 'x-logger';

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

////////////////////////////////////////////////////////////////

///////////////////////// -- XLOGGERERRORS -- /////////////////////////

/**
 * 
 * @param {string | number | symbol} methodName The method name, A property key
 * @param {string} errorMessage The Error Message
 * @param {any} thisArg thisArg Is Symbolic For Console To Represent A Bindable Usage
 */
function IncorrectMethodUsage(methodName, errorMessage, thisArg) {
  var _contains_non_word_char_regex = /\W/;
  var _incorrect_method_usage_this_name;
  var _incorrect_method_usage_method_name;

  if (typeof errorMessage !== 'string') throw XLoggerError.TypeError('\'errorMessage\' is not a string');

  if (typeof this === 'function') {
    if (this.name !== '') { _incorrect_method_usage_this_name = this.name; }
    else { _incorrect_method_usage_this_name = "Function"; }
  } else {
    if (this.constructor) { _incorrect_method_usage_this_name = this.constructor.name; }
    else { _incorrect_method_usage_this_name = 'ExoticObject'; }
  }

  if (typeof methodName === 'symbol') {
    _incorrect_method_usage_method_name = '[' + methodName.toString() + ']';
  } else if (typeof methodName === 'number' || _contains_non_word_char_regex.test(methodName)) {
    _incorrect_method_usage_method_name = '[' + methodName + ']';
  } else {
    _incorrect_method_usage_method_name = '.' + methodName;
  }

  return _incorrect_method_usage_this_name + _incorrect_method_usage_method_name + ' ' + errorMessage;
}

function RemoveStack(errorObject, depth) {
  var _remove_stack_i;
  var _remove_stack_depth = 1;

  if(depth > 1) {
    _remove_stack_depth = depth;
  }

  for(_remove_stack_i = 0; _remove_stack_i < _remove_stack_depth; _remove_stack_i++) {
    errorObject.stack = errorObject.stack.replace(/\n[^\n]*/, '');
  }
}

/**
 * @enum {0 | 1}
 */
var CallOrConstructEnum = {
  /**
   * @type {0}
   */
  CALL: 0,
  /**
   * @type {1}
   */
  CONSTRUCT: 1
}

/**
 * 
 * @param {string} functionName 
 * @param {CallOrConstructEnum} type 
 */
function InvalidCallOrConstruct(functionName, type) {
  var _invalid_call_or_contruct_func_name = '';

  if(functionName) {
    _invalid_call_or_contruct_func_name = functionName + ' ';
  }

  switch(type) {
    case 0: return _invalid_call_or_contruct_func_name + 'is not a constructor';
    case 1: return 'Class constructor ' + _invalid_call_or_contruct_func_name + ' cannot be invoked without \'new\'';
  }
}

/**
 * @typedef {Error} XLoggerError
 */

/**
 * 
 * @returns {XLoggerError}
 */
function XLoggerError() {
  var _xlogger_error_self;

  if (this instanceof XLoggerError) {
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
    RemoveStack(_xlogger_error_this);
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

XLoggerError.__THROW_INVALID_CONSTRUCT = function __THROW_INVALID_CONSTRUCT(name) {
  var __throw_invalid_construct_error = XLoggerError.TypeError(IncorrectMethodUsage.call(XLoggerError, name, InvalidCallOrConstruct('', CallOrConstructEnum.CALL)))

  RemoveStack(__throw_invalid_construct_error);

  return __throw_invalid_construct_error;
}

XLoggerError.__THROW_CUSTOM_ERROR = function __THROW_CUSTOM_ERROR(name, message) {
  var _xlogger_error_syntax_error = new XLoggerError(message, XLoggerErrorCustomName(name));

  if (IS_CHROME_ENV || IS_NODE_ENV) {
    RemoveStack(_xlogger_error_syntax_error, 2);
  }

  return _xlogger_error_syntax_error;
}

XLoggerError.SyntaxError = function SyntaxError() {
  if (this !== XLoggerError) throw XLoggerError.__THROW_INVALID_CONSTRUCT('SyntaxError');

  return XLoggerError.__THROW_CUSTOM_ERROR('Syntax', arguments[0]);
};

XLoggerError.ArgumentError = function ArgumentError() {
  if (this !== XLoggerError) throw XLoggerError.__THROW_INVALID_CONSTRUCT('ArgumentError');

  return XLoggerError.__THROW_CUSTOM_ERROR('Argument', arguments[0]);
}

XLoggerError.TypeError = function TypeError() {
  if(this !== XLoggerError) throw XLoggerError.__THROW_INVALID_CONSTRUCT('TypeError');

  return XLoggerError.__THROW_CUSTOM_ERROR('Type', arguments[0]);
}

/////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {string} key 
 * @param {string | undefined} prefix 
 */
function XLoggerMakeSymbolKey(key, prefix) {
  if (isNullOrWhiteSpace(key)) throw XLoggerError.ArgumentError('\'key\' cannot be a whitespace string');

  var _xlogger_make_symbol_key_prefix = _defaultXLoggerSymbolKeyPrefix;
  if (!isNullOrWhiteSpace(prefix)) {
    _xlogger_make_symbol_key_prefix = prefix.replace(/\.$/, '');
  }

  return _xlogger_make_symbol_key_prefix + '.' + key;
}


// var CustomSymbolPrefixSymbol = XLoggerMakeSymbolKey('custom-symbol');

/**
 * @typedef {('verbose' | 'info' | 'warn' | 'error' | 'silent')} XLoggerType
 */

/**
 * @readonly
 * @enum {0 | 1 | 2 | 3 | 4}
 */
var XLoggerTypeEnum = {
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
var XLoggerLogLevelEnum = {
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
 * @param {boolean | undefined} useStyleParser
 */
function XLogger(options, useStyleParser) {

}
