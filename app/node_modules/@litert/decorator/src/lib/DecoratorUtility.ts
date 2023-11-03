/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/**
 * Copyright 2023 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as C from './Common';

export class DecoratorUtility implements C.IDecoratorUtility {

    private readonly _staticProperties: Map<any, Array<string | symbol>> = new Map();

    private readonly _staticMethods: Map<any, Array<string | symbol>> = new Map();

    private readonly _memberProperties: Map<any, Array<string | symbol>> = new Map();

    private readonly _memberMethods: Map<any, Array<string | symbol>> = new Map();

    private _hookNativeReflectMetadata: boolean = false;

    private _bakOfMetadata!: any;

    private _bakOfDefineMetadata!: any;

    public createGeneralDecorator(
        processors: C.IGeneralDecoratorProcessorSet
    ): C.IGeneralDecorator {

        return (c: C.IClassCtor | C.IObject, k?: symbol | string, d?: any): any => {

            if (this.isClassConstructor(c)) {

                if (k === undefined) {

                    switch (typeof d) {

                        case 'undefined': // for class
                            if (!processors.class) {

                                throw new TypeError('This decorator can not apply with classes.');
                            }
                            return processors.class(c);
                        case 'number': // for class constructor parameter
                            if (!processors.ctorParameter) {

                                throw new TypeError(
                                    'This decorator can not apply with constructor parameters.'
                                );
                            }
                            return processors.ctorParameter(c, d);
                        default:
                            throw new TypeError('Invalid parameters for decorators.');
                    }
                }
                else {

                    switch (typeof k) {
                        case 'symbol':
                        case 'string':
                            break;
                        default:
                            throw new TypeError('Invalid parameters for decorators.');
                    }

                    switch (typeof d) {
                        case 'object': // for static method

                            if (d.set || d.get) {

                                if (!processors.staticAccessor) {

                                    throw new TypeError(
                                        'This decorator can not apply with static accessors.'
                                    );
                                }

                                this._registerStaticProperty(c, k);
                                return processors.staticAccessor(c, k, d);
                            }
                            else {

                                if (!processors.staticMethod) {

                                    throw new TypeError(
                                        'This decorator can not apply with static methods.'
                                    );
                                }

                                this._registerStaticMethod(c, k);
                                return processors.staticMethod(c, k, d);
                            }

                        case 'number': // for static method parameter

                            if (processors.staticMethodParameter) {

                                this._registerStaticMethod(c, k);
                                return processors.staticMethodParameter(c, k, d);
                            }

                            throw new TypeError(
                                'This decorator can not apply with static method parameters.'
                            );

                        case 'undefined': // for static property

                            if (!processors.staticProperty) {

                                throw new TypeError(
                                    'This decorator can not apply with static properties.'
                                );
                            }

                            this._registerStaticProperty(c, k);
                            return processors.staticProperty(c, k);
                        default:
                            throw new TypeError('Invalid parameters for decorators.');
                    }
                }
            }
            else if (this.isClassPrototype(c)) {

                switch (typeof k) {
                    case 'symbol':
                    case 'string':
                        break;
                    default:
                        throw new TypeError('Invalid parameters for decorators.');
                }

                switch (typeof d) {
                    case 'object': // for member method

                        if (d.set || d.get) {

                            if (!processors.accessor) {

                                throw new TypeError(
                                    'This decorator can not apply with member accessors.'
                                );
                            }

                            this._registerMemberProperty(c, k);
                            return processors.accessor(c, k, d);
                        }
                        else {

                            if (!processors.method) {

                                throw new TypeError(
                                    'This decorator can not apply with member methods.'
                                );
                            }

                            this._registerMemberMethod(c, k);
                            return processors.method(c, k, d);
                        }

                    case 'number': // for member member parameter

                        if (!processors.methodParameter) {

                            throw new TypeError(
                                'This decorator can not apply with member method parameters.'
                            );
                        }

                        this._registerMemberMethod(c, k);
                        return processors.methodParameter(c, k, d);

                    case 'undefined': // for member property

                        if (!processors.property) {

                            throw new TypeError(
                                'This decorator can not apply with member properties.'
                            );
                        }

                        this._registerMemberProperty(c, k);
                        return processors.property(c, k);
                    default:
                        throw new TypeError('Invalid parameters for decorators.');
                }
            }
            else {

                throw new TypeError('Invalid parameters for decorators.');
            }
        };
    }

    public isClassConstructor<T extends C.IClassCtor>(target: unknown): target is T {

        return typeof target === 'function' && target.toString().startsWith('class');
    }

    public isClassPrototype<T extends C.IPrototype>(target: unknown): target is T {

        return typeof target === 'object'
            && this.isClassConstructor((target as C.IObject)?.constructor);
    }

    public isInsideClassDecorator(args: any[]): args is Parameters<C.IClassDecorator> {

        return this.isClassConstructor(args[0]) && args[1] === undefined && args[2] === undefined;
    }

    public isInsideConstructorParameterDecorator(
        args: any[]
    ): args is Parameters<C.IConstructorParameterDecorator> {

        return this.isClassConstructor(args[0])
            && args[1] === undefined
            && typeof args[2] === 'number';
    }

    public isInsideMethodParameterDecorator(
        args: any[]
    ): args is Parameters<C.IMethodParameterDecorator> {

        return this.isClassPrototype(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && typeof args[2] === 'number';
    }

    public isInsideMethodDecorator(args: any[]): args is Parameters<C.IMethodDecorator> {

        return this.isClassPrototype(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && typeof args[2] === 'object'
            && typeof args[2].value === 'function';
    }

    public isInsideAccessorDecorator(args: any[]): args is Parameters<C.IMethodDecorator> {

        return this.isClassPrototype(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && typeof args[2] === 'object'
            && (args[2].set !== undefined || args[2].get !== undefined);
    }

    public isInsidePropertyDecorator(args: any[]): args is Parameters<C.IPropertyDecorator> {

        return this.isClassPrototype(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && args[2] === undefined;
    }

    public isInsideStaticMethodParameterDecorator(
        args: any[]
    ): args is Parameters<C.IStaticMethodParameterDecorator> {

        return this.isClassConstructor(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && typeof args[2] === 'number'
            && this.isStaticMethod(args[0], args[1]);
    }

    public isInsideStaticMethodDecorator(
        args: any[]
    ): args is Parameters<C.IStaticMethodDecorator> {

        return this.isClassConstructor(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && typeof args[2] === 'object'
            && typeof args[2].value === 'function';
    }

    public isInsideStaticAccessorDecorator(
        args: any[]
    ): args is Parameters<C.IStaticMethodDecorator> {

        return this.isClassConstructor(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && typeof args[2] === 'object'
            && (args[2].set !== undefined || args[2].get !== undefined);
    }

    public isInsideStaticPropertyDecorator(
        args: any[]
    ): args is Parameters<C.IStaticPropertyDecorator> {

        return this.isClassConstructor(args[0])
            && (typeof args[1] === 'symbol' || typeof args[1] === 'string')
            && args[2] === undefined;
    }

    public createClassDecorator(decorator: C.IClassDecoratorProcessor): C.IClassDecorator {

        return (ctor, k?: undefined, d?: undefined) => {

            if (!this.isInsideClassDecorator([ctor, k, d])) {

                throw new TypeError('Invalid parameters for class decorator.');
            }

            return decorator(ctor);
        };
    }

    public createConstructorParameterDecorator(
        decorator: C.IConstructorParameterDecoratorProcessor
    ): C.IConstructorParameterDecorator {

        return (ctor, method, index) => {

            if (!this.isInsideConstructorParameterDecorator([ctor, method, index])) {

                throw new TypeError(
                    'Invalid parameters for class constructor parameter decorator.'
                );
            }

            return decorator(ctor, index);
        };
    }

    public createMethodParameterDecorator(
        decorator: C.IMethodParameterDecoratorProcessor
    ): C.IMethodParameterDecorator {

        return (proto, method, index) => {

            if (!this.isInsideMethodParameterDecorator([proto, method, index])) {

                throw new TypeError('Invalid parameters for class method parameter decorator.');
            }

            this._registerMemberMethod(proto as C.IPrototype, method);

            return decorator(proto as C.IPrototype, method, index);
        };
    }

    public createMethodDecorator(decorator: C.IMethodDecoratorProcessor): C.IMethodDecorator {

        return (proto, method, descriptor) => {

            if (!this.isInsideMethodDecorator([proto, method, descriptor])) {

                throw new TypeError('Invalid parameters for class method decorator.');
            }

            this._registerMemberMethod(proto as any as C.IPrototype, method);

            return decorator(proto as any as C.IPrototype, method, descriptor);
        };
    }

    public createAccessorDecorator(decorator: C.IAccessorDecoratorProcessor): C.IMethodDecorator {

        return (proto, accessor, descriptor) => {

            if (!this.isInsideAccessorDecorator([proto, accessor, descriptor])) {

                throw new TypeError('Invalid parameters for class accessor decorator.');
            }

            this._registerMemberProperty(proto as any as C.IPrototype, accessor);

            return decorator(proto as any as C.IPrototype, accessor, descriptor);
        };
    }

    public createPropertyDecorator(decorator: C.IPropertyDecoratorProcessor): C.IPropertyDecorator {

        return (proto, name, descriptor) => {

            if (!this.isInsidePropertyDecorator([proto, name, descriptor])) {

                throw new TypeError('Invalid parameters for class property decorator.');
            }

            this._registerMemberProperty(proto as any as C.IPrototype, name);

            return decorator(proto as any as C.IPrototype, name);
        };
    }

    public createStaticMethodParameterDecorator(
        decorator: C.IStaticMethodParameterDecoratorProcessor
    ): C.IStaticMethodParameterDecorator {

        return (ctor, method, index) => {

            if (!this.isInsideStaticMethodParameterDecorator([ctor, method, index])) {

                throw new TypeError(
                    'Invalid parameters for class static method parameter decorator.'
                );
            }

            this._registerStaticMethod(ctor, method);

            return decorator(ctor, method, index);
        };
    }

    public createStaticMethodDecorator(
        decorator: C.IStaticMethodDecoratorProcessor
    ): C.IStaticMethodDecorator {

        return (ctor, method, descriptor) => {

            if (!this.isInsideStaticMethodDecorator([ctor, method, descriptor])) {

                throw new TypeError('Invalid parameters for class static method decorator.');
            }

            this._registerStaticMethod(ctor, method);

            return decorator(ctor, method, descriptor);
        };
    }

    public createStaticAccessorDecorator(
        decorator: C.IStaticAccessorDecoratorProcessor
    ): C.IStaticMethodDecorator {

        return (ctor, accessor, descriptor) => {

            if (!this.isInsideStaticAccessorDecorator([ctor, accessor, descriptor])) {

                throw new TypeError('Invalid parameters for class static accessor decorator.');
            }

            this._registerStaticProperty(ctor, accessor);

            return decorator(ctor, accessor, descriptor);
        };
    }

    public createStaticPropertyDecorator(
        decorator: C.IStaticPropertyDecoratorProcessor
    ): C.IStaticPropertyDecorator {

        return (ctor, name, descriptor) => {

            if (!this.isInsideStaticPropertyDecorator([ctor, name, descriptor])) {

                throw new TypeError('Invalid parameters for class static property decorator.');
            }

            this._registerStaticProperty(ctor, name);

            return decorator(ctor, name);
        };
    }

    public getClassOfObject(obj: C.IObject): C.IClassCtor {

        if (typeof obj !== 'object' || obj === null) {

            throw new TypeError('Can not find the class of non-object or null.');
        }

        return obj.constructor as any;
    }

    public getParentClass(cls: C.IClassCtor): C.IClassCtor | null {

        if (this.hasParentClass(cls)) {

            return (cls as any).__proto__;
        }

        return null;
    }

    public hasParentClass(cls: C.IClassCtor): boolean {

        return this.isClassConstructor(cls) && !!(cls as any).__proto__.prototype;
    }

    private _registerMemberProperty(proto: C.IPrototype, name: string | symbol): void {

        const cls = this._memberProperties.get(proto.constructor) ?? [];

        if (!cls.includes(name)) {

            cls.push(name);
        }

        this._memberProperties.set(proto.constructor, cls);
    }

    private _registerMemberMethod(proto: C.IPrototype, name: string | symbol): void {

        const cls = this._memberMethods.get(proto.constructor) ?? [];

        if (!cls.includes(name)) {

            cls.push(name);
        }

        this._memberMethods.set(proto.constructor, cls);
    }

    private _registerStaticProperty(ctor: C.IClassCtor, name: string | symbol): void {

        const cls = this._staticProperties.get(ctor) ?? [];

        if (!cls.includes(name)) {

            cls.push(name);
        }

        this._staticProperties.set(ctor, cls);
    }

    private _registerStaticMethod(ctor: C.IClassCtor, name: string | symbol): void {

        const cls = this._staticMethods.get(ctor) ?? [];

        if (!cls.includes(name)) {

            cls.push(name);
        }

        this._staticMethods.set(ctor, cls);
    }

    public isAccessor(ctor: C.IClassCtor, name: symbol | string): boolean {

        const dtr = Object.getOwnPropertyDescriptor(ctor.prototype, name);

        return dtr?.get !== undefined || dtr?.set !== undefined;
    }

    public isStaticAccessor(ctor: C.IClassCtor, name: symbol | string): boolean {

        const dtr = Object.getOwnPropertyDescriptor(ctor, name);

        return dtr?.get !== undefined || dtr?.set !== undefined;
    }

    public isMethod(ctor: C.IClassCtor, name: symbol | string): boolean {

        const dtr = Object.getOwnPropertyDescriptor(ctor.prototype, name);

        return typeof dtr?.value === 'function';
    }

    public isStaticMethod(ctor: C.IClassCtor, name: symbol | string): boolean {

        const dtr = Object.getOwnPropertyDescriptor(ctor, name);

        return typeof dtr?.value === 'function';
    }

    public getOwnMethodNames(target: C.IClassCtor): Array<string | symbol> {

        return this._memberMethods.get(target) ?? [];
    }

    public getOwnStaticMethodNames(target: C.IClassCtor): Array<string | symbol> {

        return this._staticMethods.get(target) ?? [];
    }

    public getOwnPropertyNames(target: C.IClassCtor): Array<string | symbol> {

        return this._memberProperties.get(target) ?? [];
    }

    public getOwnStaticPropertyNames(target: C.IClassCtor): Array<string | symbol> {

        return this._staticProperties.get(target) ?? [];
    }

    public isHookNativeReflectMetadata(): boolean {

        return this._hookNativeReflectMetadata;
    }

    public hookNativeReflectMetadata(enabled: boolean = true): void {

        if (this._hookNativeReflectMetadata === enabled) {

            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('reflect-metadata');

        const ref = Reflect as C.IObject;

        if (!enabled) {

            ref.metadata = this._bakOfMetadata;
            ref.defineMetadata = this._bakOfDefineMetadata;

            this._hookNativeReflectMetadata = false;

            return;
        }

        this._bakOfMetadata = ref.metadata;

        ref.metadata = (metadataKey: any, metadataValue: any): any => {

            return (target: any, propertyKey?: string | symbol, dtr?: unknown): any => {

                if (propertyKey !== undefined && typeof dtr !== 'number') {

                    if (typeof dtr === 'object') {

                        if (this.isClassConstructor(target)) {

                            this._registerStaticMethod(target, propertyKey);
                        }
                        else {

                            this._registerMemberMethod(target, propertyKey);
                        }
                    }
                    else {

                        if (this.isClassConstructor(target)) {

                            this._registerStaticProperty(target, propertyKey);
                        }
                        else {

                            this._registerMemberProperty(target, propertyKey);
                        }
                    }
                }

                if (dtr !== undefined) {

                    this._bakOfMetadata(metadataKey, metadataValue)(target, propertyKey!, dtr);
                }
                else {

                    this._bakOfMetadata(metadataKey, metadataValue)(target, propertyKey!);
                }
            };
        };

        this._bakOfDefineMetadata = ref.defineMetadata;

        ref.defineMetadata = (
            metadataKey: any,
            metadataValue: any,
            target: any,
            propertyKey?: string | symbol
        ): void => {

            if (propertyKey !== undefined) {

                if (typeof target[propertyKey] === 'function') {

                    if (this.isClassConstructor(target)) {

                        this._registerStaticMethod(target, propertyKey);
                    }
                    else {

                        this._registerMemberMethod(target, propertyKey);
                    }
                }
                else {

                    if (this.isClassConstructor(target)) {

                        this._registerStaticProperty(target, propertyKey);
                    }
                    else {

                        this._registerMemberProperty(target, propertyKey);
                    }
                }

                return this._bakOfDefineMetadata(metadataKey, metadataValue, target, propertyKey);
            }

            return this._bakOfDefineMetadata(metadataKey, metadataValue, target);
        };

        this._hookNativeReflectMetadata = true;
    }

    public composite(decorators: any[]): any {

        return function(a: any, b: any, c: any): any {

            for (const d of (decorators as Array<(...args: any[]) => any>)) {

                if (typeof c === 'object') {

                    c = d(a, b, c) ?? c;
                }
                else if (b === undefined && c === undefined) {

                    a = d(a, b, c) ?? a;
                }
                else {

                    d(a, b, c);
                }
            }

            if (typeof c === 'object') {

                return c;
            }
            else if (b === undefined && c === undefined) {

                return a;
            }

        } as any;
    }
}
