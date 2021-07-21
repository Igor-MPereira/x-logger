import { DefaultArgumentTypeError, XLoggerError } from './error.js';

export var CallOrConstructEnum = {
  /**
   * @type {0}
   */
  CALL: 0,
  /**
   * @type {1}
   */
  CONSTRUCT: 1
};

export var XLoggerLogLevelEnum = {
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
}

export function LogLevelEnumToString(LogLevel) {
  if (typeof LogLevel !== 'number') { throw XLoggerError.TypeError(DefaultArgumentTypeError('LogLevel', 'number')); }
  return ['silent', 'error', 'warning', 'info', 'verbose'][LogLevel];
}

export function StringToLogLevelEnum(LogLevelString) {
  if (typeof LogLevelString !== 'string') { throw XLoggerError.TypeError(DefaultArgumentTypeError('LogLevelString', 'string')); }
  return XLoggerLogLevelEnum[LogLevelString.toUpperCase()];
}