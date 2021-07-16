///////////////////////// -- ENV -- /////////////////////////

var IS_NODE_ENV = typeof process != 'undefined';
var IS_CHROME_ENV = typeof chrome != 'undefined';
var IS_MOZILLA_ENV = typeof Components != 'undefined';

/////////////////////////////////////////////////////////////

///////////////////////// -- POLYFILLS -- /////////////////////////

if (!String.prototype.trim) {
  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/trim#polyfill

  String.prototype.trim = function trim() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;

    return obj;
  };
}

if (!Object.getPrototypeOf) {
  Object.getPrototypeOf = function getPrototypeOf(obj) {
    return obj.__proto__;
  };
}

if (!Array.prototype.includes) {
  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#polyfill

  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function (searchElement, fromIndex) {

        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          // c. Increase k by 1.
          // NOTE: === provides the correct "SameValueZero" comparison needed here.
          if (o[k] === searchElement) {
            return true;
          }
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }
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

function IsXLoggerOptionObject(option) {
  console.log(option);
  if (typeof option !== 'object') { return false; }

  return Object.prototype.propertyIsEnumerable.call(option, 'logLevel') && typeof option.logLevel === 'number';
}

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

  if (typeof errorMessage !== 'string') throw XLoggerError.TypeError(DefaultArgumentTypeError('errorMessage', 'string'));

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

/**
 * Overrides the stack property of the Error object in 'depth' traces
 * @param {Error} errorObject 
 * @param {number | undefined} depth 
 */
function RemoveStack(errorObject, depth) {
  var _remove_stack_i;
  var _remove_stack_depth = 1;

  if (depth > 1) {
    _remove_stack_depth = depth;
  }

  for (_remove_stack_i = 0; _remove_stack_i < _remove_stack_depth; _remove_stack_i++) {
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
};

/**
 * 
 * @param {string} functionName 
 * @param {CallOrConstructEnum} type 
 */
function InvalidCallOrConstruct(functionName, type) {
  var _invalid_call_or_contruct_func_name = '';

  if (functionName) {
    _invalid_call_or_contruct_func_name = functionName + ' ';
  }

  switch (type) {
    case 0: return DefaultArgumentTypeError(_invalid_call_or_contruct_func_name, 'constructor');
    case 1: return 'Class constructor ' + _invalid_call_or_contruct_func_name + ' cannot be invoked without \'new\'';
  }
}

/**
 * @typedef {('function' | 'undefined' | 'object' | 'string' | 'number' | 'bigint' | 'symbol' | 'boolean')} JSTypes
 */

/**
 * 
 * @param {string} argName 
 * @param {JSTypes | 'constructor'} type 
 * @returns 
 */
function DefaultArgumentTypeError(argName, type) {
  return '\'' + argName + '\' is not a ' + type;
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
    && ((globalThis.disable_xlogger_prefix !== true && _xlogger_error_name.substring(0, 7) === 'XLogger') || _xlogger_error_name.substring(0, 7) !== 'XLogger')
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
      configurable: true
    },
    message: {
      value: '',
      writable: true,
      configurable: true
    },
    constructor: {
      value: XLoggerError,
      configurable: true
    }
  }
);

Object.setPrototypeOf(XLoggerError, Error);

function XLoggerErrorCustomName(name) {
  var _xlogger_error_custom_name_prefix = '';

  if (globalThis.disable_xlogger_prefix !== true) {
    _xlogger_error_custom_name_prefix = 'XLogger';
  }

  return _xlogger_error_custom_name_prefix + name + 'Error';
}

XLoggerError.__THROW_INVALID_CONSTRUCT = function __THROW_INVALID_CONSTRUCT(name) {
  var __throw_invalid_construct_error = XLoggerError.TypeError(IncorrectMethodUsage.call(XLoggerError, name, InvalidCallOrConstruct('', CallOrConstructEnum.CALL)));

  RemoveStack(__throw_invalid_construct_error);

  return __throw_invalid_construct_error;
};

XLoggerError.__THROW_CUSTOM_ERROR = function __THROW_CUSTOM_ERROR(name, message) {
  var _xlogger_error_syntax_error = new XLoggerError(message, XLoggerErrorCustomName(name));

  if (IS_CHROME_ENV || IS_NODE_ENV) {
    RemoveStack(_xlogger_error_syntax_error, 2);
  }

  return _xlogger_error_syntax_error;
};

XLoggerError.SyntaxError = function SyntaxError() {
  if (this !== XLoggerError) { throw XLoggerError.__THROW_INVALID_CONSTRUCT('SyntaxError'); };

  return XLoggerError.__THROW_CUSTOM_ERROR('Syntax', arguments[0]);
};

XLoggerError.ArgumentError = function ArgumentError() {
  if (this !== XLoggerError) { throw XLoggerError.__THROW_INVALID_CONSTRUCT('ArgumentError'); };

  return XLoggerError.__THROW_CUSTOM_ERROR('Argument', arguments[0]);
};

XLoggerError.TypeError = function TypeError() {
  if (this !== XLoggerError) throw XLoggerError.__THROW_INVALID_CONSTRUCT('TypeError');

  return XLoggerError.__THROW_CUSTOM_ERROR('Type', arguments[0]);
};

XLoggerError.ReferenceError = function ReferenceError() {
  if (this !== XLoggerError) throw XLoggerError.__THROW_INVALID_CONSTRUCT('ReferenceError');

  return XLoggerError.__THROW_CUSTOM_ERROR('Reference', arguments[0]);
};

/////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {string} key 
 * @param {string | undefined} prefix 
 */
function XLoggerMakeSymbolKey(key, prefix) {

  if (typeof key !== 'string') { throw XLoggerError.TypeError(DefaultArgumentTypeError('key', 'string')); }
  if (typeof prefix !== 'undefined' && typeof prefix !== 'string') { throw XLoggerError.TypeError(DefaultArgumentTypeError('prefix', 'string')); }

  if (isNullOrWhiteSpace(key)) { throw XLoggerError.ArgumentError('\'key\' cannot be a whitespace string'); }

  var _xlogger_make_symbol_key_prefix = 'x-logger';
  if (!isNullOrWhiteSpace(prefix)) {
    _xlogger_make_symbol_key_prefix = prefix.replace(/\.$/, '');
  }

  return _xlogger_make_symbol_key_prefix + '.' + key;
}

///////////////////////// -- XLogger -- /////////////////////////

/**
 * @typedef {('verbose' | 'info' | 'warning' | 'error' | 'silent')} XLoggerType
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
  WARNING: 2,
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
 * 
 * @param {XLoggerTypeEnum} typeEnum 
 * @returns {XLoggerType}
 */
function XLoggerTypeEnumToString(typeEnum) {
  if (typeof typeEnum !== 'number') { throw XLoggerError.TypeError(DefaultArgumentTypeError('typeEnum', 'number')); }
  return ['silent', 'error', 'warning', 'info', 'verbose'][typeEnum];
}

function XLoggerTypeStringToEnum(typeString) {
  if (typeof typeString !== 'string') { throw XLoggerError.TypeError(DefaultArgumentTypeError('typeString', 'string')); }
  return XLoggerTypeEnum[typeString.toUpperCase()];
}

/**
 * @enum {0 | 1 | 2 | 3}
 */
// TODO: Remove If Useless
// var XLoggerLogLevelEnum = {
//   /**
//    * @type {0}
//    */
//   SILENT: 0,
//   /**
//    * @type {1}
//    */
//   ERROR: 1,
//   /**
//    * @type {2}
//    */
//   WARNING: 2,
//   /**
//    * @type {3}
//    */
//   LOG: 3,
//   /**
//    * @type {3}
//    */
//   INFO: 3
// };

/**
 * @typedef XLoggerOptions
 * @property {boolean | undefined} logDateTime
 * @property {boolean | undefined} logTraceOnErrors
 * @property {boolean | undefined} logTraceOnWarnings
 * @property {boolean | undefined} useAltMethods
 * @property {XLoggerTypeEnum} logLevel
 */

/**
 * @type {XLoggerOptions}
 */
globalThis[Symbol.for(XLoggerMakeSymbolKey('config.silent'))] = {
  logDateTime: false,
  logTraceOnErrors: false,
  logTraceOnWarnings: false,
  useAltMethods: false,
  logLevel: XLoggerTypeEnum.SILENT
};

globalThis[Symbol.for(XLoggerMakeSymbolKey('config.error'))] = {
  logDateTime: false,
  logTraceOnErrors: false,
  logTraceOnWarnings: false,
  useAltMethods: false,
  logLevel: XLoggerTypeEnum.ERROR
};

globalThis[Symbol.for(XLoggerMakeSymbolKey('config.warning'))] = {
  logDateTime: false,
  logTraceOnErrors: false,
  logTraceOnWarnings: false,
  useAltMethods: false,
  logLevel: XLoggerTypeEnum.WARNING
};

globalThis[Symbol.for(XLoggerMakeSymbolKey('config.info'))] = {
  logDateTime: false,
  logTraceOnErrors: false,
  logTraceOnWarnings: false,
  useAltMethods: true,
  logLevel: XLoggerTypeEnum.INFO
};

globalThis[Symbol.for(XLoggerMakeSymbolKey('config.verbose'))] = {
  logDateTime: true,
  logTraceOnErrors: true,
  logTraceOnWarnings: true,
  useAltMethods: true,
  logLevel: XLoggerTypeEnum.VERBOSE
};

/**
 * 
 * @param {(XLoggerOptions | XLoggerType)} option 
 * @param {boolean | undefined} useStyleParser
 * @param {((...args: any[]) => any) | undefined} customLogger
 */
function XLogger(option, useStyleParser, customLogger) {
  var _xlogger_default_config = 'warning';
  var _xlogger_construct_config = globalThis[Symbol.for(XLoggerMakeSymbolKey('config.warning'))];
  var _xlogger_test_regex = /^(silent|error|warning|info|log|verbose)$/;
  var _xlogger_disable_check_symbol = Symbol(XLoggerMakeSymbolKey('disable.check'));
  var _xlogger_custom_logger_function;
  if (typeof option === 'string') {
    if (_xlogger_test_regex.test(option)) { _xlogger_default_config = option; }

    _xlogger_construct_config = globalThis[Symbol.for(XLoggerMakeSymbolKey('config.' + _xlogger_default_config))];
  } else if (IsXLoggerOptionObject(option)) {
    _xlogger_construct_config = option;
  } else {
    if (typeof option !== 'object') {
      throw XLoggerError.TypeError('Invalid option: ' + option + '. Argument option must be a valid option object or a string');
    } else {

    }
  }

  if (typeof useStyleParser !== 'undefined' && typeof useStyleParser !== 'boolean') { throw XLoggerError.TypeError(DefaultArgumentTypeError('useStyleParser', 'boolean')); }

  var _xlogger_this;

  if (this instanceof XLogger) {
    _xlogger_this = this;
  } else {
    _xlogger_this = Object.create(XLogger.prototype);
  }

  Object.assign(
    _xlogger_this,
    _xlogger_construct_config
  );

  var _xlogger_define_options_log_level = _xlogger_construct_config.logLevel;
  var _xlogger_define_options_log_date_time = _xlogger_construct_config.logDateTime;
  var _xlogger_define_options_log_trace_on_warnings = _xlogger_construct_config.logTraceOnWarnings;
  var _xlogger_define_options_log_trace_on_errors = _xlogger_construct_config.logTraceOnErrors;
  var _xlogger_define_options_use_alt_methods = _xlogger_construct_config.useAltMethods;
  var _xlogger_default_methods = Object.create(
    Object.prototype,
    {
      Warn: { value: function Warn() { } },
      Error: { value: function Error() { } },
      GroupEnd: { value: function GroupEnd() { } },
      TimeEnd: { value: function TimeEnd() { } },
      TimeLog: { value: function TimeLog() { } },
      Table: { value: function Table() { } },
      Group: { value: function Group() { } },
      Count: { value: function Count() { } },
      Info: { value: function Info() { } },
      Time: { value: function Time() { } },
      Log: { value: function Log() { } },
    }
  );

  _xlogger_this[Symbol.toStringTag] = "XLogger";
  var _xlogger_logger_symbol_key = XLoggerMakeSymbolKey('logger');
  if (typeof customLogger === 'function') {
    _xlogger_custom_logger_function = customLogger;
  } else if ('console' in globalThis && typeof console.log === 'function') {
    _xlogger_custom_logger_function = console.log;
  } else { throw XLoggerError.ReferenceError("cannot find 'console' in global object or 'log' in console is not a function. Provide an alternative logger"); }

  var _xlogger_uses_style_parser = useStyleParser === true;
  Object.defineProperty(
    _xlogger_this,
    Symbol.for(XLoggerMakeSymbolKey('logger.handler')),
    {
      value: function (logger, minLogLevel, isAltMethod) {
        if ((_xlogger_this.logLevel < minLogLevel) || (isAltMethod && !_xlogger_define_options_use_alt_methods)) { return; }

        var _xlogger_logger_handler_args = Array.apply(null, arguments).slice(3);

        if (_xlogger_uses_style_parser) {
          _xlogger_logger_handler_args = ParseStyles(_xlogger_logger_handler_args);
        }

        logger.apply(null, _xlogger_logger_handler_args);
      }
    }
  );

  Object.defineProperties(
    _xlogger_this,
    {
      [Symbol.for(_xlogger_logger_symbol_key)]: { value: _xlogger_custom_logger_function },
      setLogger: {
        value: function setLogger(logger) {

          if (typeof logger !== 'function') {
            throw XLoggerError.TypeError(DefaultArgumentTypeError('logger', 'function'));
          }

          _xlogger_this[Symbol.for(_xlogger_logger_symbol_key)] = logger;
        }
      },
      usesStyleParser: {
        get: function usesStyleParser() { return _xlogger_uses_style_parser; },
        set: function usesStyleParser(setUsesStyleParser) {
          if (typeof setUsesStyleParser !== 'boolean') {
            throw XLoggerError.TypeError('cannot assign type \'' + typeof setUsesStyleParser + '\' to usesStyleParser. Must assign a boolean value');
          }

          _xlogger_uses_style_parser = setUsesStyleParser;
        }
      },
      IfWarning: { get: function IfWarning() { return ConditionalChaining.call(_xlogger_this, XLoggerTypeEnum.WARNING); } },
      IfVerbose: { get: function IfVerbose() { return ConditionalChaining.call(_xlogger_this, XLoggerTypeEnum.VERBOSE); } },
      IfSilent: { get: function IfSilent() { return ConditionalChaining.call(_xlogger_this, XLoggerTypeEnum.SILENT); } },
      IfError: { get: function IfError() { return ConditionalChaining.call(_xlogger_this, XLoggerTypeEnum.ERROR); } },
      IfInfo: { get: function IfInfo() { return ConditionalChaining.call(_xlogger_this, XLoggerTypeEnum.INFO); } },
      logLevel: {
        get: function logLevel() { return _xlogger_define_options_log_level; },
        set: function logLevel(value) {
          if (typeof value === 'string' && ['silent', 'error', 'warning', 'info', 'log', 'verbose'].includes(value)) {
            _xlogger_define_options_log_level = XLoggerTypeStringToEnum(value);
          } else if (typeof value === 'number' && [0, 1, 2, 3, 4].includes(value)) {
            _xlogger_define_options_log_level = value;
          } else {
            var _xlogger_internal_setter_error = XLoggerError.TypeError('\'' + value + '\' is not a valid LogLevel value');
            RemoveStack(_xlogger_internal_setter_error);
            throw _xlogger_internal_setter_error;
          }
        }
      },
      logDateTime: {
        get: function logDateTime() { return _xlogger_define_options_log_date_time; },
        set: function logDateTime(value) {
          if (typeof value !== 'boolean') {
            var _xlogger_internal_setter_error = XLoggerError.TypeError('type \'' + typeof value + '\' is not a valid logDateTime type');
            RemoveStack(_xlogger_internal_setter_error);
            throw _xlogger_internal_setter_error;
          }

          _xlogger_define_options_log_date_time = value;
        }
      },
      logTraceOnErrors: {
        get: function logTraceOnErrors() { return _xlogger_define_options_log_trace_on_errors; },
        set: function logTraceOnErrors(value) {
          if (typeof value !== 'boolean') {
            var _xlogger_internal_setter_error = XLoggerError.TypeError('type \'' + typeof value + '\' is not a valid logTraceOnErrors type');
            RemoveStack(_xlogger_internal_setter_error);
            throw _xlogger_internal_setter_error;
          }

          _xlogger_define_options_log_trace_on_errors = value;
        }
      },
      logTraceOnWarnings: {
        get: function logTraceOnWarnings() { return _xlogger_define_options_log_trace_on_warnings; },
        set: function logTraceOnWarnings(value) {
          if (typeof value !== 'boolean') {
            var _xlogger_internal_setter_error = XLoggerError.TypeError('type \'' + typeof value + '\' is not a valid logTraceOnWarnings type');
            RemoveStack(_xlogger_internal_setter_error);
            throw _xlogger_internal_setter_error;
          }

          _xlogger_define_options_log_trace_on_warnings = value;
        }
      },
      useAltMethods: {
        get: function useAltMethods() { return _xlogger_define_options_use_alt_methods; },
        set: function useAltMethods(value) {
          if (typeof value !== 'boolean') {
            var _xlogger_internal_setter_error = XLoggerError.TypeError('type \'' + typeof value + '\' is not a valid useAltMethods type');
            RemoveStack(_xlogger_internal_setter_error);
            throw _xlogger_internal_setter_error;
          }

          _xlogger_define_options_use_alt_methods = value;
        }
      },
      Warn: { value: MountLoggerFunction('warn', XLoggerTypeEnum.WARNING) },
      Error: { value: MountLoggerFunction('error', XLoggerTypeEnum.ERROR) },
      GroupEnd: { value: MountLoggerFunction('groupEnd', XLoggerTypeEnum.ERROR, true) },
      TimeEnd: { value: MountLoggerFunction('timeEnd', XLoggerTypeEnum.ERROR, true) },
      TimeLog: { value: MountLoggerFunction('timeLog', XLoggerTypeEnum.ERROR, true) },
      Table: { value: MountLoggerFunction('table', XLoggerTypeEnum.ERROR, true) },
      Group: { value: MountLoggerFunction('group', XLoggerTypeEnum.ERROR, true) },
      Count: { value: MountLoggerFunction('count', XLoggerTypeEnum.ERROR, true) },
      Info: { value: MountLoggerFunction('info', XLoggerTypeEnum.INFO) },
      Time: { value: MountLoggerFunction('time', XLoggerTypeEnum.ERROR, true) },
      Log: { value: MountLoggerFunction('log', XLoggerTypeEnum.INFO) },
      [Symbol.for(XLoggerMakeSymbolKey('logger.builder'))]: { value: MountLoggerFunction }
    }
  );

  function MountLoggerFunction(name, minLogLevel, isAltMethod) {
    if (typeof isAltMethod !== 'boolean') {
      isAltMethod = false;
    }

    var _xlogger_mount_logger_custom_function;
    if (typeof _xlogger_this[Symbol.for(XLoggerMakeSymbolKey('logger.' + name))] === 'function') {
      _xlogger_mount_logger_custom_function = _xlogger_this[Symbol.for(XLoggerMakeSymbolKey('logger.' + name))];
    } else if (name in console) {
      _xlogger_mount_logger_custom_function = console[name];
    } else { throw XLoggerError.ReferenceError('could not find \'' + name + '\' in console. Define an alternative logger'); }

    var _xlogger_mount_logger_function = _xlogger_this[Symbol.for(XLoggerMakeSymbolKey('logger.handler'))].bind(_xlogger_this, _xlogger_mount_logger_custom_function, minLogLevel, isAltMethod);

    return _xlogger_mount_logger_function;
  }

  var _xlogger_non_blocking_methods = Object.create(
    Object.prototype,
    {
      Warn: { value: MountLoggerFunction('warn', XLoggerTypeEnum.SILENT) },
      Error: { value: MountLoggerFunction('error', XLoggerTypeEnum.SILENT) },
      GroupEnd: { value: MountLoggerFunction('groupEnd', XLoggerTypeEnum.SILENT) },
      TimeEnd: { value: MountLoggerFunction('timeEnd', XLoggerTypeEnum.SILENT) },
      TimeLog: { value: MountLoggerFunction('timeLog', XLoggerTypeEnum.SILENT) },
      Table: { value: MountLoggerFunction('table', XLoggerTypeEnum.SILENT) },
      Group: { value: MountLoggerFunction('group', XLoggerTypeEnum.SILENT) },
      Count: { value: MountLoggerFunction('count', XLoggerTypeEnum.SILENT) },
      Info: { value: MountLoggerFunction('info', XLoggerTypeEnum.SILENT) },
      Time: { value: MountLoggerFunction('time', XLoggerTypeEnum.SILENT) },
      Log: { value: MountLoggerFunction('log', XLoggerTypeEnum.SILENT) }
    }
  );

  function ConditionalChaining(logLevel) {
    if (_xlogger_define_options_log_level >= logLevel) {
      return _xlogger_non_blocking_methods;
    }

    return _xlogger_default_methods;
  }

  function ParseStyle(args) {
    /*
    TODO
    */

    return args;
  }

  return _xlogger_this;
}

///////////////////////////////////////////////////////////////