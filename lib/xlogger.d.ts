import { XLoggerLogLevelEnum, XLoggerLogLevelKeyword } from './enum';

export interface XLoggerOptionObject {
  logLevel: number;
  logDateTime?: boolean;
  useAltMethods?: boolean;
}

export interface XLoggerMethod {
  (...args: Array<any>): void;
  loggerFunction: XLoggerLoggerFunction;
  loggerHandler: XLoggerLoggerHandler;
  minLogLevel: XLoggerLogLevelEnum;
}

export interface XLoggerMethodMap {
  Group: XLoggerMethod;
  GroupEnd: XLoggerMethod;
  Log: XLoggerMethod;
  Info: XLoggerMethod;
  Warn: XLoggerMethod;
  Error: XLoggerMethod;
  Table: XLoggerMethod;
  Time: XLoggerMethod;
  TimeLog: XLoggerMethod;
  TimeEnd: XLoggerMethod;
  Count: XLoggerMethod;
}

export interface XLogger extends XLoggerMethodMap {
  usesStyleParser: boolean;
  logLevel: XLoggerLogLevelEnum;
  logDateTime: boolean;
  useAltMethods: boolean;
  IfSilent: XLoggerMethodMap;
  IfError: XLoggerMethodMap;
  IfWarning: XLoggerMethodMap;
  IfInfo: XLoggerMethodMap;
  IfVerbose: XLoggerMethodMap;
}

export interface XLoggerLoggerFunction {
  (...args: Array<any>): void;
}

export interface XLoggerLoggerHandler {
  (args: Array<any>, minLogLevel: XLoggerLogLevelEnum, func: XLoggerLoggerFunction, isAltMethod: boolean, logger: XLogger): void;
}

export interface XLoggerMethodBuilder {
  (name: string, minLogLevel: XLoggerLogLevelEnum, func: XLoggerLoggerFunction, isAltMethod?: boolean, silentInclude?: boolean, handler?: XLoggerLoggerHandler): void;
}

export interface XLoggerConstructor {
  (keyword: string): XLogger;
  (option: XLoggerOptionObject): XLogger;
  (keyword: XLoggerLogLevelKeyword): XLogger;
  (keyword: string, useStyleParser: boolean): XLogger;
  (option: XLoggerOptionObject, useStylePArser: boolean): XLogger;
  (keyword: XLoggerLogLevelKeyword, useStyleParser: boolean): XLogger;
  // TS cannot infer output from Symbols thus the logger handler will remain 'hidden' from the XLogger constructor interface.
  // [Symbol.for(XLoggerMakeSymbolKey('logger.handler'))]: XLoggerLoggerHandler;

  readonly BuildXLoggerMethod: XLoggerMethodBuilder;
  readonly prototype: XLogger;
}

declare var XLogger: XLoggerConstructor;

export default XLogger;