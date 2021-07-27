import { XLoggerLogLevelEnum } from './enum.js';
import { XLoggerMakeSymbolKey } from './utils.js';

Object.defineProperty(
  globalThis,
  Symbol.for(XLoggerMakeSymbolKey('config.silent')),
  {
    value: {
      logDateTime: false,
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
      useAltMethods: true,
      logLevel: XLoggerLogLevelEnum.VERBOSE
    }
  }
);