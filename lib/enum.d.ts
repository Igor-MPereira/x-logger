export enum CallOrConstructEnum {
  CALL = 0,
  CONSTRUCT = 1
};

export enum XLoggerLogLevelEnum {
  SILENT = 0,
  ERROR = 1,
  WARNING = 2,
  INFO = 3,
  LOG = 3,
  VERBOSE = 4
}

export type XLoggerLogLevelKeyword = 'silent' | 'error' | 'warning' | 'info' | 'log' | 'verbose';

export function LogLevelEnumToString(logLevel: XLoggerLogLevelEnum): XLoggerLogLevelKeyword;

export function StringToLogLevelEnum(logLevelString: XLoggerLogLevelKeyword): XLoggerLogLevelEnum;