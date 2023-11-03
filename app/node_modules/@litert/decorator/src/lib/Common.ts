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

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type IMaybeVoid<T> = T | void;

export type IObject = Record<string, any>;

export type IClassCtor<T = any> = new (...args: any[]) => T;

export interface IPrototype<T extends IClassCtor = IClassCtor> extends Record<string, any> {

    constructor: T;
}

/**
 * The decorator signature of class decorators.
 */
export type IClassDecorator = <T extends IClassCtor>(ctor: T) => IMaybeVoid<T>;

/**
 * The decorator signature of class static method decorators.
 */
export type IStaticMethodDecorator = (
    ctor: IClassCtor,
    propKey: string | symbol,
    dtr: TypedPropertyDescriptor<any>
) => IMaybeVoid<TypedPropertyDescriptor<any>>;

/**
 * The decorator signature of class static property decorators.
 */
export type IStaticPropertyDecorator = (
    ctor: IClassCtor,
    propKey: string | symbol,
    dtr?: undefined
) => void;

/**
 * The decorator signature of class static method parameter decorators.
 */
export type IStaticMethodParameterDecorator = (
    ctor: IClassCtor,
    propKey: string | symbol,
    index: number
) => void;

/**
 * The decorator signature of class member method decorators.
 */
export type IMethodDecorator = <T>(
    prototype: T,
    propKey: T extends IClassCtor ? never : string | symbol,
    dtr: TypedPropertyDescriptor<any>
) => IMaybeVoid<TypedPropertyDescriptor<any>>;

/**
 * The decorator signature of class member method parameter decorators.
 */
export type IMethodParameterDecorator = (
    prototype: IObject,
    propKey: string | symbol,
    index: number
) => void;

/**
 * The decorator signature of class member property decorators.
 */
export type IPropertyDecorator = <T>(
    prototype: T,
    propKey: T extends IClassCtor ? never : string | symbol,
    dtr?: undefined
) => void;

/**
 * The decorator signature of class constructor parameter decorators.
 */
export type IConstructorParameterDecorator = (
    ctor: IClassCtor,
    method: undefined,
    index: number
) => void;

/**
 * The processor signature of class decorators.
 */
export type IClassDecoratorProcessor = (ctor: IClassCtor) => void;

/**
 * The processor signature of class static property decorators.
 */
export type IStaticPropertyDecoratorProcessor = (
    ctor: IClassCtor,
    propKey: string | symbol
) => void;

/**
 * The processor signature of class static method decorators.
 */
export type IStaticMethodDecoratorProcessor = (
    ctor: IClassCtor,
    propKey: string | symbol,
    dtr: TypedPropertyDescriptor<any>
) => IMaybeVoid<TypedPropertyDescriptor<any>>;

/**
 * The processor signature of class static method parameter decorators.
 */
export type IStaticMethodParameterDecoratorProcessor = (
    ctor: IClassCtor,
    propKey: string | symbol,
    index: number
) => void;

/**
 * The processor signature of class static accessor decorators.
 */
export type IStaticAccessorDecoratorProcessor = (
    ctor: IClassCtor,
    propKey: string | symbol,
    dtr: TypedPropertyDescriptor<any>
) => IMaybeVoid<TypedPropertyDescriptor<any>>;

/**
 * The processor signature of class member method decorators.
 */
export type IMethodDecoratorProcessor = (
    prototype: IPrototype,
    propKey: string | symbol,
    dtr: TypedPropertyDescriptor<any>
) => IMaybeVoid<TypedPropertyDescriptor<any>>;

/**
 * The processor signature of class member method parameter decorators.
 */
export type IMethodParameterDecoratorProcessor = (
    prototype: IPrototype,
    propKey: string | symbol,
    index: number
) => void;

/**
 * The processor signature of class member accessor decorators.
 */
export type IAccessorDecoratorProcessor = (
    prototype: IPrototype,
    propKey: string | symbol,
    dtr: TypedPropertyDescriptor<any>
) => IMaybeVoid<TypedPropertyDescriptor<any>>;

/**
 * The processor signature of class member property decorators.
 */
export type IPropertyDecoratorProcessor = (
    prototype: IPrototype,
    propKey: string | symbol
) => void;

/**
 * The processor signature of class constructor parameter decorators.
 */
export type IConstructorParameterDecoratorProcessor = (ctor: IClassCtor, index: number) => void;

/**
 * Signature of any decorator.
 */
export interface IGeneralDecorator {
    (target: IClassCtor): any;
    (target: IObject, propertyKey: undefined | string | symbol, index?: any): any;
}

export interface IGeneralDecoratorProcessorSet {

    class?: IClassDecoratorProcessor;

    ctorParameter?: IConstructorParameterDecoratorProcessor;

    property?: IPropertyDecoratorProcessor;

    staticProperty?: IStaticPropertyDecoratorProcessor;

    method?: IMethodDecoratorProcessor;

    staticMethod?: IStaticMethodDecoratorProcessor;

    methodParameter?: IMethodParameterDecoratorProcessor;

    staticMethodParameter?: IStaticMethodParameterDecoratorProcessor;

    accessor?: IAccessorDecoratorProcessor;

    staticAccessor?: IStaticAccessorDecoratorProcessor;
}

export interface IDecoratorUtility {

    /**
     * Create a decorator that suits all given type of decorators with type checking.
     *
     * > There is no need to call `isInside***Decorator` method insides the decorator callback.
     *
     * @param processor The callback of general decorator.
     */
    createGeneralDecorator(processors: IGeneralDecoratorProcessorSet): IGeneralDecorator;

    /**
     * Create a class decorator with type checking.
     *
     * > There is no need to call `isInsideClassDecorator` method insides the decorator callback.
     *
     * @param processor The callback of class decorator.
     */
    createClassDecorator(processor: IClassDecoratorProcessor): IClassDecorator;

    /**
     * Create a constructor parameter decorator with type checking.
     *
     * > There is no need to call `isInsideConstructorParameterDecorator` method insides the
     * > decorator callback.
     *
     * @param processor The callback of class constructor parameter decorator.
     */
    createConstructorParameterDecorator(
        processor: IConstructorParameterDecoratorProcessor
    ): IConstructorParameterDecorator;

    /**
     * Create a class member method parameter decorator with type checking.
     *
     * > There is no need to call `isInsideMethodParameterDecorator` method insides the decorator
     * > callback.
     *
     * @param processor The callback of class member method parameter decorator.
     */
    createMethodParameterDecorator(
        processor: IMethodParameterDecoratorProcessor
    ): IMethodParameterDecorator;

    /**
     * Create a class member method decorator with type checking.
     *
     * > There is no need to call `isInsideMethodDecorator` method insides the decorator callback.
     *
     * @param processor The callback of class member method decorator.
     */
    createMethodDecorator(processor: IMethodDecoratorProcessor): IMethodDecorator;

    /**
     * Create a class member accessor decorator with type checking.
     *
     * > There is no need to call `isInsideAccessorDecorator` accessor insides the decorator
     * > callback.
     *
     * @param processor The callback of class member accessor decorator.
     */
    createAccessorDecorator(processor: IAccessorDecoratorProcessor): IMethodDecorator;

    /**
     * Create a class member property decorator with type checking.
     *
     * > There is no need to call `isInsidePropertyDecorator` method insides the decorator callback.
     *
     * @param processor The callback of class member property decorator.
     */
    createPropertyDecorator(processor: IPropertyDecoratorProcessor): IPropertyDecorator;

    /**
     * Create a class static method parameter decorator with type checking.
     *
     * > There is no need to call `isInsideStaticMethodParameterDecorator` method insides the
     * > decorator callback.
     *
     * @param processor The callback of class static method parameter decorator.
     */
    createStaticMethodParameterDecorator(
        processor: IStaticMethodParameterDecoratorProcessor
    ): IStaticMethodParameterDecorator;

    /**
     * Create a class static method decorator with type checking.
     *
     * > There is no need to call `isInsideStaticMethodDecorator` method insides the decorator
     * > callback.
     *
     * @param processor The callback of class static method decorator.
     */
    createStaticMethodDecorator(processor: IStaticMethodDecoratorProcessor): IStaticMethodDecorator;

    /**
     * Create a class static accessor decorator with type checking.
     *
     * > There is no need to call `isInsideStaticAccessorDecorator` accessor insides the decorator
     * > callback.
     *
     * @param processor The callback of class static accessor decorator.
     */
    createStaticAccessorDecorator(
        processor: IStaticAccessorDecoratorProcessor
    ): IStaticMethodDecorator;

    /**
     * Create a class static property decorator with type checking.
     *
     * > There is no need to call `isInsideStaticPropertyDecorator` method insides the decorator
     * > callback.
     *
     * @param processor The callback of class static property decorator.
     */
    createStaticPropertyDecorator(
        processor: IStaticPropertyDecoratorProcessor
    ): IStaticPropertyDecorator;

    /**
     * Check if the decorator is used for a class.
     *
     * > **Use in the decorator callback.**
     *
     * @param args The arguments passed to the decorator.
     */
    isInsideClassDecorator(args: any[]): args is Parameters<IClassDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class constructor
     * parameter decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideConstructorParameterDecorator(
        args: any[]
    ): args is Parameters<IConstructorParameterDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class method parameter
     * decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideMethodParameterDecorator(args: any[]): args is Parameters<IMethodParameterDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class method decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideMethodDecorator(args: any[]): args is Parameters<IMethodDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class accessor decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideAccessorDecorator(args: any[]): args is Parameters<IMethodDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class property decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsidePropertyDecorator(args: any[]): args is Parameters<IPropertyDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class method parameter
     * decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideStaticMethodParameterDecorator(
        args: any[]
    ): args is Parameters<IStaticMethodParameterDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class method decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideStaticMethodDecorator(args: any[]): args is Parameters<IStaticMethodDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a static accessor decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideStaticAccessorDecorator(args: any[]): args is Parameters<IStaticMethodDecorator>;

    /**
     * Check the arguments of decorator to determined if it's called as a class property decorator.
     *
     * > **Use in the decorator callback.**
     *
     * @param args  The arguments passed to the decorator.
     */
    isInsideStaticPropertyDecorator(args: any[]): args is Parameters<IStaticPropertyDecorator>;

    /**
     * Determine if the input object is a constructor of class.
     *
     * @param target    The object to be checked.
     */
    isClassConstructor<T extends IClassCtor>(target: unknown): target is T;

    /**
     * Determine if the input object is a prototype of class.
     *
     * @param target    The object to be checked.
     */
    isClassPrototype<T extends IPrototype>(target: unknown): target is T;

    /**
     * Get the names of ever decorated member methods owned by given class, excluding the member
     * methods inherited from parent classes.
     *
     * @param target The given class.
     */
    getOwnMethodNames(target: IClassCtor): Array<string | symbol>;

    /**
     * Get the names of ever decorated static methods owned by given class, excluding the static
     * methods inherited from parent classes.
     *
     * @param target The given class.
     */
    getOwnStaticMethodNames(target: IClassCtor): Array<string | symbol>;

    /**
     * Get the names of ever decorated member properties owned by given class, excluding the
     * member properties inherited from parent classes.
     *
     * @param target The given class.
     */
    getOwnPropertyNames(target: IClassCtor): Array<string | symbol>;

    /**
     * Get the names of ever decorated static properties owned by given class, excluding the
     * static properties inherited from parent classes.
     *
     * @param target The given class.
     */
    getOwnStaticPropertyNames(target: IClassCtor): Array<string | symbol>;

    /**
     * Get the parent class of a given class.
     *
     * @param target    The given class.
     */
    getParentClass(target: IClassCtor): IClassCtor | null;

    /**
     * Check if a class extends from any a parent/based class..
     *
     * @param target    The given class.
     */
    hasParentClass(target: IClassCtor): boolean;

    /**
     * Get the class constructor of given object.
     *
     * @param obj   The object to be operated.
     */
    getClassOfObject(obj: IObject): IClassCtor;

    /**
     * Add a hook on native `reflect-metadata` module to get properties and methods of all classes.
     *
     * > Only works when the options `experimentalDecorators` and `emitDecoratorMetadata` are
     * > turned on in **tsconfig.json** while using TypeScript.
     *
     * @param enabled   Set to true to enable hooks, or disable when false [default: true]
     */
    hookNativeReflectMetadata(enabled?: boolean): void;

    /**
     * Check if the hook on native `reflect-metadata` module is enabled.
     */
    isHookNativeReflectMetadata(): boolean;

    /**
     * Determined if an member of class is a method.
     *
     * @param ctor  The ctor of class.
     * @param name  The name of member in class.
     */
    isMethod(ctor: IClassCtor, name: string | symbol): boolean;

    /**
     * Determined if an static member of class is a method.
     *
     * @param ctor  The ctor of class.
     * @param name  The name of static member in class.
     */
    isStaticMethod(ctor: IClassCtor, name: string | symbol): boolean;

    /**
     * Determined if an member of class is a getter or setter.
     *
     * @param ctor  The ctor of class.
     * @param name  The name of member in class.
     */
    isAccessor(ctor: IClassCtor, name: string | symbol): boolean;

    /**
     * Determined if an static member of class is a getter or setter.
     *
     * @param ctor  The ctor of class.
     * @param name  The name of static member in class.
     */
    isStaticAccessor(ctor: IClassCtor, name: string | symbol): boolean;

    /**
     * Composite multiple same-type decorator into a one.
     *
     * > The decorators will be applied in order of the decorator array.
     *
     * @param decorators The decorators list.
     */
    composite<
        T extends IGeneralDecorator | IClassDecorator | IMethodParameterDecorator |
        IMethodDecorator | IConstructorParameterDecorator | IStaticMethodDecorator |
        IStaticMethodParameterDecorator | IPropertyDecorator | IStaticPropertyDecorator
    >(decorators: T[]): T;
}
