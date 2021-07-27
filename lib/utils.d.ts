import { XLoggerOptionObject } from './xlogger';

export function isNullOrUndefined(value: string | null | undefined): boolean;

export function isNullOrEmpty(value: string | null | undefined): boolean;

export function isNullOrWhiteSpace(value: string | null | undefined): boolean;

export function isXLoggerOptionObject(value: unknown): value is XLoggerOptionObject;

export type ObjectToArrayHint = 'key' | 'value' | 'entry';
export type ObjectToArrayEntry<TValue = any> = [ key: string, value: TValue ];

export interface ObjectToArrayKeyModifier<TResult = any> {
  (key: string): TResult;
}

export interface ObjectToArrayValueModifier<TValue = any, TResult = any> {
  (value: TValue): TResult;
}

export interface ObjectToArrayEntryModifier<TValue = any, TResult = any> {
  (entry: ObjectToArrayEntry<TValue>): TResult;
}

export type ObjectToArrayModifier<TResult = any, TValue = any> = 
  ObjectToArrayKeyModifier<TResult> | 
  ObjectToArrayValueModifier<TValue, TResult> | 
  ObjectToArrayEntryModifier<TValue, TResult>;

export function ObjectToArray<TResult = any>(o: unknown, hint?: ObjectToArrayHint, modifier?: ObjectToArrayModifier<TResult>): Array<TResult>;
export function ObjectToArray<TResult = any>(o: unknown, hint?: 'key', modifier?: ObjectToArrayKeyModifier<TResult>): Array<TResult>;
export function ObjectToArray<TResult = any, TValue = any>(o: unknown, hint?: 'value', modifier?: ObjectToArrayValueModifier<TValue, TResult>): Array<TResult>;
export function ObjectToArray<TResult = any, TValue = any>(o: unknown, hint?: 'entry', modifier?: ObjectToArrayEntryModifier<TValue, TResult>): Array<TResult>;

export type XLoggerSymbolKey<TKey extends string = string> = `xlogger.${TKey}`;
export type XLoggerCompoundSymbolKey<TKey extends string = string, TPrefix extends string = string> = `${TPrefix}.${TKey}`;

export function XLoggerMakeSymbolKey<TKey extends string = string>(key: TKey): XLoggerSymbolKey<TKey>;
export function XLoggerMakeSymbolKey<TKey extends string = string, TPrefix extends string = string>(key: TKey, prefix: TPrefix): XLoggerCompoundSymbolKey<TKey, TPrefix>;
export function XLoggerMakeSymbolKey<TKey extends string = string, TPrefix = string | undefined>(key: string, prefix?: TPrefix): TPrefix extends string ? XLoggerCompoundSymbolKey<TKey, TPrefix> : XLoggerSymbolKey<TKey>;