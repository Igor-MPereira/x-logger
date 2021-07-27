import { CallOrConstructEnum } from './enum';
import { XLoggerConstructor } from './xlogger';

export function IncorrectMethodUsage(methodName: string, errorMessage: string): string;

export interface BaseError {
  stack: string;
}

export function RemoveStack(errorObject: BaseError, depth?: number): void;

export function InvalidCallOrConstruct(functionName: string, type: CallOrConstructEnum): string;

export type ECMATypes = 'function' | 'object' | 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined';

export function DefaultArgumentTypeError(argName: string, type: ECMATypes | 'constructor');

export interface XLoggerError extends Error { }
export interface XLoggerSyntaxError extends XLoggerError { }
export interface XLoggerArgumentError extends XLoggerError { }
export interface XLoggerTypeError extends XLoggerError { }
export interface XLoggerReferenceError extends XLoggerError { }

export interface XLoggerErrorConstructor {
  SyntaxError(message?: string): XLoggerSyntaxError;
  ArgumentError(message?: string): XLoggerArgumentError;
  TypeError(message?: string): XLoggerTypeError;
  ReferenceError(message?: string): XLoggerReferenceError;
  readonly prototype: XLoggerError;
}

export var XLoggerError: XLoggerConstructor;

export function XLoggerErrorCustomName(name: string): string;