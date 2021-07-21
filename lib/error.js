export function IncorrectMethodUsage(methodName, errorMessage) {
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

export function RemoveStack(errorObject, depth) {
  var _remove_stack_i;
  var _remove_stack_depth = 1;

  if (depth > 1) {
    _remove_stack_depth = depth;
  }

  for (_remove_stack_i = 0; _remove_stack_i < _remove_stack_depth; _remove_stack_i++) {
    errorObject.stack = errorObject.stack.replace(/\n[^\n]*/, '');
  }
}

export function InvalidCallOrConstruct(functionName, type) {
  var _invalid_call_or_contruct_func_name = '';

  if (functionName) {
    _invalid_call_or_contruct_func_name = functionName + ' ';
  }

  switch (type) {
    case 0: return DefaultArgumentTypeError(_invalid_call_or_contruct_func_name, 'constructor');
    case 1: return 'Class constructor ' + _invalid_call_or_contruct_func_name + ' cannot be invoked without \'new\'';
  }
}

export function DefaultArgumentTypeError(argName, type) {
  return '\'' + argName + '\' is not a ' + type;
}

export function XLoggerError() {
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

export function XLoggerErrorCustomName(name) {
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