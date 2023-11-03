/**
 * Copyright 2021 Angus.Fenying <fenying@litert.org>
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

import type * as $Decorators from '@litert/decorator';

export type IMetadataKey = number | string | symbol;

export type IDesignType = $Decorators.IClassCtor | void;

export type IIdentityKey = string | symbol;

export interface IReflectManager {

    /**
     * Create a define-metadata decorator method.
     *
     * @param key   The key of metadata to be defined.
     * @param value The value of metadata to be defined.
     *
     * @returns An all-kinds compatitable decorator.
     */
    metadata(key: IMetadataKey, value: any): $Decorators.IGeneralDecorator;

    createGeneralMetadataDecorator(
        key: IMetadataKey,
        value: any,
        positions?: Array<keyof $Decorators.IGeneralDecoratorProcessorSet>,
    ): $Decorators.IGeneralDecorator;

    /**
     * Create a set-metadata decorator for class.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createClassMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IClassDecorator;

    /**
     * Create a set-metadata decorator for constructor parameter.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createConstructorParameterMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IConstructorParameterDecorator;

    /**
     * Create a set-metadata decorator for method.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createMethodMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IMethodDecorator;

    /**
     * Create a set-metadata decorator for method parameter.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createMethodParameterMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IMethodParameterDecorator;

    /**
     * Create a set-metadata decorator for static method.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createStaticMethodMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IStaticMethodDecorator;

    /**
     * Create a set-metadata decorator for static method parameter.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createStaticMethodParameterMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IStaticMethodParameterDecorator;

    /**
     * Create a set-metadata decorator for accessor.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createAccessorMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IMethodDecorator;

    /**
     * Create a set-metadata decorator for static accessor.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createStaticAccessorMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IStaticMethodDecorator;

    /**
     * Create a set-metadata decorator for property.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createPropertyMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IPropertyDecorator;

    /**
     * Create a set-metadata decorator for static property.
     *
     * @param key       The key of metadata.
     * @param value     The value of metadata.
     */
    createStaticPropertyMetadataDecorator(
        key: IMetadataKey,
        value: any,
    ): $Decorators.IStaticPropertyDecorator;

    /**
     * Delete the specific metadata of a class, by metadata key.
     *
     * @param target    The class constructor.
     * @param key       The key of metadata to be deleted.
     */
    deleteClassMetadata(
        target: $Decorators.IClassCtor,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a constructor parameter, by metadata key.
     *
     * @param ctor      The class.
     * @param index     The index of constructor parameter.
     * @param key       The key of metadata to be deleted.
     */
    deleteConstructorParameterMetadata(
        ctor: $Decorators.IClassCtor,
        index: number,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a method, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     * @param key       The key of metadata to be deleted.
     */
    deleteMethodMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a method parameter, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     * @param index     The index of method parameter.
     * @param key       The key of metadata to be deleted.
     */
    deleteMethodParameterMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a static method, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     * @param key       The key of metadata to be deleted.
     */
    deleteStaticMethodMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a static method parameter, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     * @param index     The index of static method parameter.
     * @param key       The key of metadata to be deleted.
     */
    deleteStaticMethodParameterMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a accessor, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of accessor.
     * @param key       The key of metadata to be deleted.
     */
    deleteAccessorMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a static accessor, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static accessor.
     * @param key       The key of metadata to be deleted.
     */
    deleteStaticAccessorMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a property, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of property.
     * @param key       The key of metadata to be deleted.
     */
    deletePropertyMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): void;

    /**
     * Delete the specific metadata of a static property, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static property.
     * @param key       The key of metadata to be deleted.
     */
    deleteStaticPropertyMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): void;

    /**
     * Get the metadata value of a class, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param target    The given class.
     * @param key       The key of metadata to be fetch.
     */
    getClassMetadata(
        target: $Decorators.IClassCtor,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a constructor parameter, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param index     The index of constructor parameter.
     * @param key       The key of metadata to be fetch.
     */
    getConstructorParameterMetadata(
        ctor: $Decorators.IClassCtor,
        index: number,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a method, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     * @param key       The key of metadata to be fetch.
     */
    getMethodMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a method parameter, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     * @param index     The index of method parameter.
     * @param key       The key of metadata to be fetch.
     */
    getMethodParameterMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a static method, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     * @param key       The key of metadata to be fetch.
     */
    getStaticMethodMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a static method parameter, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     * @param index     The index of static method parameter.
     * @param key       The key of metadata to be fetch.
     */
    getStaticMethodParameterMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a accessor, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of accessor.
     * @param key       The key of metadata to be fetch.
     */
    getAccessorMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a static accessor, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of static accessor.
     * @param key       The key of metadata to be fetch.
     */
    getStaticAccessorMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a property, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of property.
     * @param key       The key of metadata to be fetch.
     */
    getPropertyMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): any;

    /**
     * Get the metadata value of a static property, by metadata key.
     *
     * > Return `undefined` if metadata is not set or deleted.
     *
     * @param ctor      The class.
     * @param name      The name of static property.
     * @param key       The key of metadata to be fetch.
     */
    getStaticPropertyMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey
    ): any;

    /**
     * Get all metadata keys of a class.
     *
     * @param target    The class constructor.
     */
    getClassMetadataKeys(target: $Decorators.IClassCtor): IMetadataKey[];

    /**
     * Get all metadata keys of a constructor parameter.
     *
     * @param ctor      The class.
     * @param index     The index of constructor parameter.
     */
    getConstructorParameterMetadataKeys(
        ctor: $Decorators.IClassCtor,
        index: number,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a method.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     */
    getMethodMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a method parameter.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     * @param index     The index of method parameter.
     */
    getMethodParameterMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a static method.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     */
    getStaticMethodMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a static method parameter.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     * @param index     The index of static method parameter.
     */
    getStaticMethodParameterMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a accessor.
     *
     * @param ctor      The class.
     * @param name      The name of accessor.
     */
    getAccessorMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a static accessor.
     *
     * @param ctor      The class.
     * @param name      The name of static accessor.
     */
    getStaticAccessorMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a property.
     *
     * @param ctor      The class.
     * @param name      The name of property.
     */
    getPropertyMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IMetadataKey[];

    /**
     * Get all metadata keys of a static property.
     *
     * @param ctor      The class.
     * @param name      The name of static property.
     */
    getStaticPropertyMetadataKeys(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IMetadataKey[];

    /**
     * Get design type of a constructor parameters from native `reflect-metadata` library.
     *
     * @param ctor      The class.
     */
    getConstructorParameterTypes(ctor: $Decorators.IClassCtor): IDesignType[] | null;

    /**
     * Get design type of a method parameter from native `reflect-metadata` library.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     */
    getMethodParameterTypes(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType[] | null;

    /**
     * Get design type of a static method parameter.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     */
    getStaticMethodParameterTypes(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType[] | null;

    /**
     * Get design type of a accessor.
     *
     * @param ctor      The class.
     * @param name      The name of accessor.
     */
    getAccessorType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Get design type of a static accessor.
     *
     * @param ctor      The class.
     * @param name      The name of static accessor.
     */
    getStaticAccessorType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Get design type of a accessor.
     *
     * @param ctor      The class.
     * @param name      The name of accessor.
     */
    getAccessorParameterType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Get design type of a static accessor.
     *
     * @param ctor      The class.
     * @param name      The name of static accessor.
     */
    getStaticAccessorParameterType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Get design type of a property.
     *
     * @param ctor      The class.
     * @param name      The name of property.
     */
    getPropertyType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Get design type of a static property.
     *
     * @param ctor      The class.
     * @param name      The name of static property.
     */
    getStaticPropertyType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Get designed return type of a method.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     */
    getMethodReturnType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Get designed return type of a static method.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     */
    getStaticMethodReturnType(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
    ): IDesignType | null;

    /**
     * Set the value of metadata of a class, by metadata key.
     *
     * @param target    The given class.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setClassMetadata(
        target: $Decorators.IClassCtor,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a constructor parameter, by metadata key.
     *
     * @param ctor      The class.
     * @param index     The index of constructor parameter.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setConstructorParameterMetadata(
        ctor: $Decorators.IClassCtor,
        index: number,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a method, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setMethodMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a method parameter, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of method.
     * @param index     The index of method parameter.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setMethodParameterMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a static method, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setStaticMethodMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a static method parameter, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static method.
     * @param index     The index of static method parameter.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setStaticMethodParameterMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        index: number,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a accessor, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of accessor.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setAccessorMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a static accessor, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static accessor.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setStaticAccessorMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a property, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of property.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setPropertyMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey,
        value: any
    ): void;

    /**
     * Set the value of metadata of a static property, by metadata key.
     *
     * @param ctor      The class.
     * @param name      The name of static property.
     * @param key       The key of metadata to be defined.
     * @param value     The value of metadata.
     */
    setStaticPropertyMetadata(
        ctor: $Decorators.IClassCtor,
        name: IIdentityKey,
        key: IMetadataKey,
        value: any
    ): void;

    configureMetadata(key: IMetadataKey, opts: Partial<IMetadataOptions>): void;
}

export interface IMetadataOptions {

    /**
     * The processing rule while duplicated metadata applied in the same element.
     */
    onDuplicated: 'overwrite' | 'multiple' | 'reject';

    /**
     * The validator of data executed before saved into metadata vessel.
     */
    validator?: (v: any) => boolean;

    /**
     * The wrapper of data executed before saved into metadata vessel.
     */
    wrapper?: (v: any) => any;
}
