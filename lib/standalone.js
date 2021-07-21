//#region ///////////////////////// -- POLYFILLS -- /////////////////////////

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

//#endregion /////////////////////////////////////////////////////////////////

//#region ///////////////////////// -- HELPERS -- /////////////////////////

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

function ObjectToArray(o, hint, modifier) {
  var _xlogger_object = Object(o);
  var _xlogger_object_to_array = [];
  switch (hint) {
    case 'key':
      for (var key in _xlogger_object) {
        if (Object.prototype.hasOwnProperty.call(_xlogger_object, key)) {
          var _xlogger_object_to_array_key = key;

          if (typeof modifier === 'function') {
            _xlogger_object_to_array_key = modifier(key);
            if (typeof _xlogger_object_to_array_key !== 'number' && typeof _xlogger_object_to_array_key !== 'string') { throw XLoggerError.ArgumentError('\'modifier\' result for \'key\' hint was not a string or number'); }
          }

          _xlogger_object_to_array.push(_xlogger_object_to_array_key);
        }
      }

      return _xlogger_object_to_array;
    case 'value':
      for (var key in _xlogger_object) {
        if (Object.prototype.hasOwnProperty.call(_xlogger_object, key)) {
          var _xlogger_object_value = _xlogger_object[key];

          if (typeof modifier === 'function') {
            _xlogger_object_value = modifier(_xlogger_object_value);
          }

          _xlogger_object_to_array.push(_xlogger_object_value);
        }
      }

      return _xlogger_object_to_array;
    case 'entry':
    default:
      for (var key in _xlogger_object) {
        if (Object.prototype.hasOwnProperty.call(_xlogger_object, key)) {
          var _xlogger_object_entry = [key, _xlogger_object[key]];

          if (typeof modifier === 'function') {
            _xlogger_object_entry = Array.apply(null, modifier([_xlogger_object_entry[0], _xlogger_object_entry[1]]));
            if (typeof _xlogger_object_entry !== 'object' || _xlogger_object_entry.length !== 2) { throw XLoggerError.ArgumentError('\'modifier\' result for \'entry\' hint wat not a key-value pair array-like'); }
          }

          _xlogger_object_to_array.push(_xlogger_object_entry);
        }
      }

      return _xlogger_object_to_array;
  }
}

//#endregion ////////////////////////////////////////////////////////////////

//#region ///////////////////////// -- XLOGGERERRORS -- /////////////////////////

/**
 * 
 * @param {string | number | symbol} methodName The method name, A property key
 * @param {string} errorMessage The Error Message
 */
function IncorrectMethodUsage(methodName, errorMessage) {
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

  if (typeof methodName === 'symbol' || (typeof methodName === 'number' || _contains_non_word_char_regex.test(methodName))) {
    _incorrect_method_usage_method_name = '[' + methodName.toString() + ']';
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
  } else if (typeof chrome != 'undefined' || typeof process !== 'undefined') {
    RemoveStack(_xlogger_error_this);
  } else { } /*else if(typeof Components != 'undefined') {
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

  if (typeof chrome != 'undefined' || typeof process !== 'undefined') {
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
 * @param {string} key 
 * @param {string | undefined} prefix 
 * @returns {string}
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
var XLoggerLogLevelEnum = {
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
   * @type {3}
   */
  LOG: 3,
  /**
   * @type {4}
   */
  VERBOSE: 4
};

/**
 * 
 * @param {XLoggerLogLevelEnum} typeEnum 
 * @returns {XLoggerType}
 */
function LogLevelEnumToString(XLoggerType) {
  if (typeof XLoggerType !== 'number') { throw XLoggerError.TypeError(DefaultArgumentTypeError('XLoggerType', 'number')); }
  return ['silent', 'error', 'warning', 'info', 'verbose'][XLoggerType];
}

/**
 * 
 * @param {XLoggerType} XLoggerType 
 * @returns {XLoggerLogLevelEnum}
 */
function StringToLogLevelEnum(XLoggerType) {
  if (typeof XLoggerType !== 'string') { throw XLoggerError.TypeError(DefaultArgumentTypeError('XLoggerType', 'string')); }
  return XLoggerLogLevelEnum[XLoggerType.toUpperCase()];
}

/**
 * @typedef XLoggerOptions
 * @property {boolean | undefined} logDateTime
 * @property {boolean | undefined} logTraceOnErrors
 * @property {boolean | undefined} logTraceOnWarnings
 * @property {boolean | undefined} useAltMethods
 * @property {XLoggerLogLevelEnum} logLevel
 */

/**
 * @type {XLoggerOptions}
 */
Object.defineProperty(
  globalThis,
  Symbol.for(XLoggerMakeSymbolKey('config.silent')),
  {
    value: {
      logDateTime: false,
      logTraceOnErrors: false,
      logTraceOnWarnings: false,
      useAltMethods: false,
      logLevel: XLoggerLogLevelEnum.SILENT
    }
  }
);

Object.defineProperty(
  globalThis,
  Symbol.for(XLoggerMakeSymbolKey('config.error')),
  {
    value: {
      logDateTime: false,
      logTraceOnErrors: false,
      logTraceOnWarnings: false,
      useAltMethods: false,
      logLevel: XLoggerLogLevelEnum.ERROR
    }
  }
);

Object.defineProperty(
  globalThis,
  Symbol.for(XLoggerMakeSymbolKey('config.warning')),
  {
    value: {
      logDateTime: false,
      logTraceOnErrors: false,
      logTraceOnWarnings: false,
      useAltMethods: false,
      logLevel: XLoggerLogLevelEnum.WARNING
    }
  }
);

Object.defineProperty(
  globalThis,
  Symbol.for(XLoggerMakeSymbolKey('config.info')),
  {
    value: {
      logDateTime: false,
      logTraceOnErrors: false,
      logTraceOnWarnings: false,
      useAltMethods: true,
      logLevel: XLoggerLogLevelEnum.INFO
    }
  }
);

Object.defineProperty(
  globalThis,
  Symbol.for(XLoggerMakeSymbolKey('config.verbose')),
  {
    value: {
      logDateTime: true,
      logTraceOnErrors: true,
      logTraceOnWarnings: true,
      useAltMethods: true,
      logLevel: XLoggerLogLevelEnum.VERBOSE
    }
  }
);

/**
 * 
 * @param {(XLoggerOptions | XLoggerType)} option 
 * @param {boolean | undefined} useStyleParser
 */
function XLogger(option, useStyleParser) {
  var _xlogger_default_config = 'warning';
  var _xlogger_construct_config = globalThis[Symbol.for(XLoggerMakeSymbolKey('config.warning'))];
  // TODO: Remove If Useless
  // var _xlogger_disable_check_symbol = Symbol(XLoggerMakeSymbolKey('disable.check'));
  if (typeof option === 'string') {
    if (ObjectToArray(XLoggerLogLevelEnum, 'key', function (value) { return value.toLowerCase(); }).includes(option.toLowerCase())) { _xlogger_default_config = option; }

    _xlogger_construct_config = globalThis[Symbol.for(XLoggerMakeSymbolKey('config.' + _xlogger_default_config))];
  } else if (typeof option === 'object' && IsXLoggerOptionObject(option)) {
    _xlogger_construct_config = option;
  } else if (typeof option !== 'undefined') { throw XLoggerError.TypeError('Invalid option: ' + option + '. Argument option must be a valid option object or a string'); }

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
  var _xlogger_define_options_log_date_time = (typeof _xlogger_construct_config.logDateTime == 'boolean' && _xlogger_construct_config.logDateTime) || false;
  var _xlogger_define_options_log_trace_on_warnings = (typeof _xlogger_construct_config.logDateTime == 'boolean' && _xlogger_construct_config.logTraceOnWarnings) || false;
  var _xlogger_define_options_log_trace_on_errors = (typeof _xlogger_construct_config.logDateTime == 'boolean' && _xlogger_construct_config.logTraceOnErrors) || false;
  var _xlogger_define_options_use_alt_methods = (typeof _xlogger_construct_config.logDateTime == 'boolean' && _xlogger_construct_config.useAltMethods) || false;
  var _xlogger_empty_methods = Object.create(Object.prototype, { Warn: { value: function Warn() { } }, Error: { value: function Error() { } }, GroupEnd: { value: function GroupEnd() { } }, TimeEnd: { value: function TimeEnd() { } }, TimeLog: { value: function TimeLog() { } }, Table: { value: function Table() { } }, Group: { value: function Group() { } }, Count: { value: function Count() { } }, Info: { value: function Info() { } }, Time: { value: function Time() { } }, Log: { value: function Log() { } }, } );

  _xlogger_this[Symbol.toStringTag] = "XLogger";

  var _xlogger_uses_style_parser = useStyleParser === true;

  Object.defineProperties(
    _xlogger_this,
    {
      usesStyleParser: {
        get: function usesStyleParser() { return _xlogger_uses_style_parser; },
        set: function usesStyleParser(setUsesStyleParser) {
          if (typeof setUsesStyleParser !== 'boolean') {
            throw XLoggerError.TypeError('cannot assign type \'' + typeof setUsesStyleParser + '\' to usesStyleParser. Must assign a boolean value');
          }

          _xlogger_uses_style_parser = setUsesStyleParser;
        }
      },
      IfWarning: { get: function IfWarning() { return ConditionalChaining.call(_xlogger_this, XLoggerLogLevelEnum.WARNING); } },
      IfVerbose: { get: function IfVerbose() { return ConditionalChaining.call(_xlogger_this, XLoggerLogLevelEnum.VERBOSE); } },
      IfSilent: { get: function IfSilent() { return ConditionalChaining.call(_xlogger_this, XLoggerLogLevelEnum.SILENT); } },
      IfError: { get: function IfError() { return ConditionalChaining.call(_xlogger_this, XLoggerLogLevelEnum.ERROR); } },
      IfInfo: { get: function IfInfo() { return ConditionalChaining.call(_xlogger_this, XLoggerLogLevelEnum.INFO); } },
      logLevel: {
        get: function logLevel() { return _xlogger_define_options_log_level; },
        set: function logLevel(value) {
          if (typeof value === 'string' && ObjectToArray(XLoggerLogLevelEnum, 'key', function (value) { return value.toLowerCase(); }).includes(value.toLowerCase())) {
            _xlogger_define_options_log_level = StringToLogLevelEnum(value);
          } else if (typeof value === 'number' && ObjectToArray(XLoggerLogLevelEnum, 'value').includes(value)) {
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
      }
    }
  );

  function PrivateBuildXLoggerMethod(func, minLogLevel) {
    return function () {
      var _xlogger_private_args;

      if (arguments.length === 1) {
        _xlogger_private_args = [arguments[0]];
      } else {
        _xlogger_private_args = Array.apply(null, arguments);
      }

      XLogger[Symbol.for(XLoggerMakeSymbolKey('logger.handler'))].call(null, _xlogger_private_args, minLogLevel, func, false, _xlogger_this);
    };
  }

  var _xlogger_non_blocking_methods = Object.create(
    Object.prototype,
    {
      Warn: { value: PrivateBuildXLoggerMethod(console.warn, XLoggerLogLevelEnum.SILENT) },
      Error: { value: PrivateBuildXLoggerMethod(console.error, XLoggerLogLevelEnum.SILENT) },
      GroupEnd: { value: PrivateBuildXLoggerMethod(console.groupEnd, XLoggerLogLevelEnum.SILENT) },
      TimeEnd: { value: PrivateBuildXLoggerMethod(console.timeEnd, XLoggerLogLevelEnum.SILENT) },
      TimeLog: { value: PrivateBuildXLoggerMethod(console.timeLog, XLoggerLogLevelEnum.SILENT) },
      Table: { value: PrivateBuildXLoggerMethod(console.table, XLoggerLogLevelEnum.SILENT) },
      Group: { value: PrivateBuildXLoggerMethod(console.group, XLoggerLogLevelEnum.SILENT) },
      Count: { value: PrivateBuildXLoggerMethod(console.count, XLoggerLogLevelEnum.SILENT) },
      Info: { value: PrivateBuildXLoggerMethod(console.info, XLoggerLogLevelEnum.SILENT) },
      Time: { value: PrivateBuildXLoggerMethod(console.time, XLoggerLogLevelEnum.SILENT) },
      Log: { value: PrivateBuildXLoggerMethod(console.log, XLoggerLogLevelEnum.SILENT) }
    }
  );

  function ConditionalChaining(logLevel) {
    if (_xlogger_define_options_log_level >= logLevel) {
      if (this[Symbol.for(XLoggerMakeSymbolKey('logger.custom'))].length > 0) {
        for (var _index in this[Symbol.for(XLoggerMakeSymbolKey('logger.custom'))]) {
          var _xlogger_conditional_custom_add = this[Symbol.for(XLoggerMakeSymbolKey('logger.custom'))][_index];
          Object.defineProperty(
            _xlogger_non_blocking_methods,
            _xlogger_conditional_custom_add,
            { value: PrivateBuildXLoggerMethod(this[_xlogger_conditional_custom_add].loggerFunction, XLoggerLogLevelEnum.SILENT) }
          );

          this[Symbol.for(XLoggerMakeSymbolKey('logger.custom'))].splice(_index, 1);
        }
      }

      return _xlogger_non_blocking_methods;
    }

    return _xlogger_empty_methods;
  }

  function ParseStyle(args) {
    /*
    TODO

    Style Parser
    */

    return args;
  }

  return _xlogger_this;
}
Object.defineProperty(
  XLogger,
  Symbol.for(XLoggerMakeSymbolKey('logger.handler')),
  {
    value: function (args, minLogLevel, func, isAltMethod, logger) {
      if ((logger.logLevel < minLogLevel) || (isAltMethod && !logger.useAltMethods) || args.length === 0) { return; }

      var _xlogger_logger_handler_args;

      if (logger.usesStyleParser) { _xlogger_logger_handler_args = ParseStyles(args); }
      else { _xlogger_logger_handler_args = args; }

      func.apply(null, _xlogger_logger_handler_args);
    }
  }
);

Object.defineProperty(
  XLogger,
  'BuildXLoggerMethod',
  {
    value: function BuildXLoggerMethod(name, minLogLevel, func, isAltMethod, silentInclude, handler) {
      if (typeof func != 'function') { throw XLoggerError.TypeError(DefaultArgumentTypeError('func', 'function')); }
      if (typeof isAltMethod != 'undefined' && typeof isAltMethod != 'boolean') { throw XLoggerError.TypeError(DefaultArgumentTypeError('isAltMethod', 'boolean')); }
      if (typeof handler != 'undefined' && typeof handler != 'function') { throw XLoggerError.TypeError('handler', 'function'); }
      if (!ObjectToArray(XLoggerLogLevelEnum, 'value').includes(minLogLevel)) { throw XLoggerError.TypeError("\'minLogLevel\' is not contained within \'XLoggerLogLevelEnum\'"); }

      var _xlogger_build_logger_handler;
      var _xlogger_build_logger_function = func;
      var _xlogger_build_logger_min_log_level = minLogLevel;
      if (typeof handler == 'function') { _xlogger_build_logger_handler = handler; }
      else { _xlogger_build_logger_handler = XLogger[Symbol.for(XLoggerMakeSymbolKey('logger.handler'))]; }


      Object.defineProperty(
        XLogger.prototype,
        name,
        {
          value: function () {
            var _xlogger_custom_method_args;

            if (arguments.length === 1) {
              _xlogger_custom_method_args = [arguments[0]];
            } else {
              _xlogger_custom_method_args = Array.apply(null, arguments);
            }

            _xlogger_build_logger_handler.call(null, _xlogger_custom_method_args, _xlogger_build_logger_min_log_level, _xlogger_build_logger_function, isAltMethod, this);
          }
        }
      );

      if (!XLogger.prototype[Symbol.for(XLoggerMakeSymbolKey('logger.custom'))]) { XLogger.prototype[Symbol.for(XLoggerMakeSymbolKey('logger.custom'))] = []; }
      if (silentInclude !== true) { XLogger.prototype[Symbol.for(XLoggerMakeSymbolKey('logger.custom'))].push(name); }

      Object.defineProperty(
        XLogger.prototype[name],
        'loggerFunction',
        {
          get: function loggerFunction() { return _xlogger_build_logger_function; },
          set: function loggerFunction(value) { if (typeof value == 'function') { _xlogger_build_logger_function = value; } }
        }
      );

      Object.defineProperty(
        XLogger.prototype[name],
        'loggerHandler',
        {
          get: function loggerHandler() { return _xlogger_build_logger_handler; },
          set: function loggerHandler(value) { if (typeof value == 'function') { _xlogger_build_logger_handler = value; } }
        }
      );

      Object.defineProperty(
        XLogger.prototype[name],
        'minLogLevel',
        {
          get: function minLogLevel() { return _xlogger_build_logger_min_log_level; },
          set: function minLogLevel(value) { if (ObjectToArray(XLoggerLogLevelEnum, 'value').includes(value)) { _xlogger_build_logger_min_log_level = value; } }
        }
      );
    }
  }
);

XLogger.prototype = Object.create(
  XLogger.prototype,
  {
    constructor: {
      writable: true,
      configurable: true,
      value: XLogger
    },
  }
);

XLogger.BuildXLoggerMethod('GroupEnd', XLoggerLogLevelEnum.ERROR, console.groupEnd, true, true);
XLogger.BuildXLoggerMethod('TimeEnd', XLoggerLogLevelEnum.ERROR, console.timeEnd, true, true);
XLogger.BuildXLoggerMethod('TimeLog', XLoggerLogLevelEnum.ERROR, console.timeLog, true, true);
XLogger.BuildXLoggerMethod('Table', XLoggerLogLevelEnum.ERROR, console.table, true, true);
XLogger.BuildXLoggerMethod('Group', XLoggerLogLevelEnum.ERROR, console.group, true, true);
XLogger.BuildXLoggerMethod('Count', XLoggerLogLevelEnum.ERROR, console.count, true, true);
XLogger.BuildXLoggerMethod('Time', XLoggerLogLevelEnum.ERROR, console.time, true, true);
XLogger.BuildXLoggerMethod('Warn', XLoggerLogLevelEnum.WARNING, console.warn, false, true);
XLogger.BuildXLoggerMethod('Error', XLoggerLogLevelEnum.ERROR, console.error, false, true);
XLogger.BuildXLoggerMethod('Info', XLoggerLogLevelEnum.INFO, console.info, false, true);
XLogger.BuildXLoggerMethod('Log', XLoggerLogLevelEnum.INFO, console.log, false, true);

///////////////////////////////////////////////////////////////