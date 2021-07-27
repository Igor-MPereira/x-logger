import { DefaultArgumentTypeError, XLoggerError } from './error.js';

export function isNullOrUndefined(value) { return value === null || value === undefined; }
export function isNullOrEmpty(value) { return value === null || value === undefined || value === ''; }
/**
 * 
 * @param {string | undefined | null} value 
 * @returns {boolean}
 */
export function isNullOrWhiteSpace(value) { return value === null || value === undefined || String(value).trim() === ''; }

export function IsXLoggerOptionObject(option) {
  if (typeof option !== 'object') { return false; }

  return Object.prototype.propertyIsEnumerable.call(option, 'logLevel') && typeof option.logLevel === 'number';
}

export function ObjectToArray(o, hint, modifier) {
  var _xlogger_object = Object(o);
  var _xlogger_object_to_array = [];
  switch (hint) {
    case 'key':
      for (var key in _xlogger_object) {
        if (Object.prototype.hasOwnProperty.call(_xlogger_object, key)) {
          var _xlogger_object_to_array_key = key;

          if (typeof modifier === 'function') {
            _xlogger_object_to_array_key = modifier(key);
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
          }

          _xlogger_object_to_array.push(_xlogger_object_entry);
        }
      }

      return _xlogger_object_to_array;
  }
}

export function XLoggerMakeSymbolKey(key, prefix) {

  if (typeof key !== 'string') { throw XLoggerError.TypeError(DefaultArgumentTypeError('key', 'string')); }
  if (typeof prefix !== 'undefined' && typeof prefix !== 'string') { throw XLoggerError.TypeError(DefaultArgumentTypeError('prefix', 'string')); }

  if (isNullOrWhiteSpace(key)) { throw XLoggerError.ArgumentError('\'key\' cannot be a whitespace string'); }

  var _xlogger_make_symbol_key_prefix = 'x-logger';
  if (!isNullOrWhiteSpace(prefix)) {
    _xlogger_make_symbol_key_prefix = prefix.replace(/\.$/, '');
  }

  return _xlogger_make_symbol_key_prefix + '.' + key;
}