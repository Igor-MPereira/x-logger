import { StringToLogLevelEnum, XLoggerLogLevelEnum } from './enum.js';
import { DefaultArgumentTypeError, RemoveStack, XLoggerError } from './error.js';
import { IsXLoggerOptionObject, ObjectToArray, XLoggerMakeSymbolKey } from './utils.js';

export function XLogger(option, useStyleParser) {
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
  var _xlogger_define_options_use_alt_methods = (typeof _xlogger_construct_config.logDateTime == 'boolean' && _xlogger_construct_config.useAltMethods) || false;
  var _xlogger_empty_methods = Object.create(Object.prototype, { Warn: { value: function Warn() { } }, Error: { value: function Error() { } }, GroupEnd: { value: function GroupEnd() { } }, TimeEnd: { value: function TimeEnd() { } }, TimeLog: { value: function TimeLog() { } }, Table: { value: function Table() { } }, Group: { value: function Group() { } }, Count: { value: function Count() { } }, Info: { value: function Info() { } }, Time: { value: function Time() { } }, Log: { value: function Log() { } }, });
  globalThis[Symbol.for(XLoggerMakeSymbolKey('logger.empty.methods'))] = _xlogger_empty_methods;
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

      /* if (logger.usesStyleParser) { _xlogger_logger_handler_args = ParseStyles(args); }
      else {*/ _xlogger_logger_handler_args = args; /*} TODO */

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
    usesStyleParser: { get: function usesStyleParser() { return false; } },
    IfWarning: { get: function IfWarning() { return globalThis[Symbol.for(XLoggerMakeSymbolKey('logger.empty.methods'))]; } },
    IfVerbose: { get: function IfVerbose() { return globalThis[Symbol.for(XLoggerMakeSymbolKey('logger.empty.methods'))]; } },
    IfSilent: { get: function IfSilent() { return globalThis[Symbol.for(XLoggerMakeSymbolKey('logger.empty.methods'))]; } },
    IfError: { get: function IfError() { return globalThis[Symbol.for(XLoggerMakeSymbolKey('logger.empty.methods'))]; } },
    IfInfo: { get: function IfInfo() { return globalThis[Symbol.for(XLoggerMakeSymbolKey('logger.empty.methods'))]; } },
    logLevel: { get: function logLevel() { return 0; } },
    logDateTime: { get: function logDateTime() { return false; } },
    useAltMethods: { get: function useAltMethods() { return false; } }
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
