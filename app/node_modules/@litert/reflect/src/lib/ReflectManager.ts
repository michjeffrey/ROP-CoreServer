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

import * as C from './Common';
import 'reflect-metadata';
import $DecoratorHelper, * as $Decorators from '@litert/decorator';

type IMetadataVessel = Map<C.IMetadataKey, any[]>;

interface IClassData {

    readonly data: IMetadataVessel;

    readonly methods: Map<C.IIdentityKey, IMethodData>;

    readonly properties: Map<C.IIdentityKey, Map<string | symbol, any>>;

    readonly staticMethods: Map<C.IIdentityKey, IMethodData>;

    readonly staticProperties: Map<C.IIdentityKey, Map<string | symbol, any>>;

    /**
     * The parameters of class constructor.
     */
    readonly parameters: Map<number, IMetadataVessel>;
}

interface IMethodData {

    readonly data: IMetadataVessel;

    readonly parameters: Map<number, IMetadataVessel>;
}

interface IReflectData {

    readonly classes: WeakMap<$Decorators.IClassCtor, IClassData>;

    readonly metadata: Map<C.IMetadataKey, C.IMetadataOptions>;
}

const privData: WeakMap<ReflectManager, IReflectData> = new WeakMap();

function prepareClass(rm: ReflectManager, target: $Decorators.IClassCtor): IClassData {

    const $data = privData.get(rm)!;

    if (!$data.classes.has(target)) {

        $data.classes.set(target, {
            'data': new Map(),
            'methods': new Map(),
            'properties': new Map(),
            'staticMethods': new Map(),
            'staticProperties': new Map(),
            'parameters': new Map()
        });
    }

    return $data.classes.get(target)!;
}

function prepareCtorParam(
    rm: ReflectManager,
    target: $Decorators.IClassCtor,
    index: number
): IMetadataVessel {

    const $data = prepareClass(rm, target);

    if (!$data.parameters.has(index)) {

        $data.parameters.set(index, new Map());
    }

    return $data.parameters.get(index)!;
}

function prepareMethod(
    rm: ReflectManager,
    target: $Decorators.IClassCtor,
    name: C.IIdentityKey,
): IMethodData {

    const $data = prepareClass(rm, target);

    if (!$data.methods.has(name)) {

        $data.methods.set(name, {
            'data': new Map(),
            'parameters': new Map()
        });
    }

    return $data.methods.get(name)!;
}

function prepareMethodParam(
    rm: ReflectManager,
    target: $Decorators.IClassCtor,
    name: C.IIdentityKey,
    index: number
): IMetadataVessel {

    const $data = prepareMethod(rm, target, name);

    if (!$data.parameters.has(index)) {

        $data.parameters.set(index, new Map());
    }

    return $data.parameters.get(index)!;
}

function prepareProperty(
    rm: ReflectManager,
    target: $Decorators.IClassCtor,
    name: C.IIdentityKey
): IMetadataVessel {

    const $data = prepareClass(rm, target);

    if (!$data.properties.has(name)) {

        $data.properties.set(name, new Map());
    }

    return $data.properties.get(name)!;
}

function prepareStaticMethod(
    rm: ReflectManager,
    target: $Decorators.IClassCtor,
    name: C.IIdentityKey
): IMethodData {

    const $data = prepareClass(rm, target);

    if (!$data.staticMethods.has(name)) {

        $data.staticMethods.set(name, {
            'data': new Map(),
            'parameters': new Map()
        });
    }

    return $data.staticMethods.get(name)!;
}

function prepareStaticMethodParam(
    rm: ReflectManager,
    target: $Decorators.IClassCtor,
    name: C.IIdentityKey,
    index: number
): IMetadataVessel {

    const $data = prepareStaticMethod(rm, target, name);

    if (!$data.parameters.has(index)) {

        $data.parameters.set(index, new Map());
    }

    return $data.parameters.get(index)!;
}

function prepareStaticProperty(
    rm: ReflectManager,
    target: $Decorators.IClassCtor,
    name: C.IIdentityKey
): IMetadataVessel {

    const $data = prepareClass(rm, target);

    if (!$data.staticProperties.has(name)) {

        $data.staticProperties.set(name, new Map());
    }

    return $data.staticProperties.get(name)!;
}

function getMetadataDefinition(mgr: ReflectManager, key: C.IMetadataKey,): C.IMetadataOptions {

    const $data = privData.get(mgr)!;

    if (!$data.metadata.has(key)) {

        return {
            'onDuplicated': 'overwrite'
        };
    }

    return $data.metadata.get(key)!;
}

function metadataKeyToString(k: C.IMetadataKey): string {

    return typeof k === 'symbol' ? (k as any).description : k;
}

function setMetadata(
    mgr: ReflectManager,
    vessel: Map<C.IMetadataKey, any[]>,
    key: C.IMetadataKey,
    value: any
): void {

    const opts = getMetadataDefinition(mgr, key);

    if (opts.validator && !opts.validator(value)) {

        throw new TypeError(`Invalid value for metadata "${metadataKeyToString(key)}".`);
    }

    let slot = vessel.get(key) ?? [];

    if (opts.wrapper) {

        value = opts.wrapper(value);
    }

    if (slot.length) {

        switch (opts.onDuplicated) {
            case 'overwrite':
                slot[0] = value;
                break;
            case 'multiple':
                slot.push(value);
                break;
            case 'reject':
                throw new Error(`Cat not edit a existing metadata "${metadataKeyToString(key)}".`);
            default:
                throw new Error(`Failed to update the metadata "${metadataKeyToString(key)}".`);
        }
    }
    else {

        slot.push(value);
    }

    vessel.set(key, slot);
}

function getMetadata(
    mgr: ReflectManager,
    vessel: Map<C.IMetadataKey, any[]>,
    key: C.IMetadataKey
): any {

    const opts = getMetadataDefinition(mgr, key);

    let slot = vessel.get(key) ?? [];

    if (slot.length) {

        switch (opts.onDuplicated) {
            case 'overwrite':
            case 'reject':
                return slot[0];
            case 'multiple':
                return slot;
            default:
                throw new Error(`Failed to get the metadata "${metadataKeyToString(key)}".`);
        }
    }

    return undefined;
}

class ReflectManager implements C.IReflectManager {

    public constructor() {

        privData.set(this, {

            'classes': new WeakMap(),
            'metadata': new Map()
        });
    }

    public setClassMetadata(
        target: $Decorators.IClassCtor,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareClass(this, target).data, key, value);
    }

    public setConstructorParameterMetadata(
        target: $Decorators.IClassCtor,
        index: number,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareCtorParam(this, target, index), key, value);
    }

    public setMethodMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareMethod(this, target, name).data, key, value);
    }

    public setStaticMethodMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareStaticMethod(this, target, name).data, key, value);
    }

    public setAccessorMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareProperty(this, target, name), key, value);
    }

    public setStaticAccessorMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareStaticProperty(this, target, name), key, value);
    }

    public setPropertyMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareProperty(this, target, name), key, value);
    }

    public setStaticPropertyMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareStaticProperty(this, target, name), key, value);
    }

    public setMethodParameterMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareMethodParam(this, target, name, index), key, value);
    }

    public setStaticMethodParameterMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
        key: C.IMetadataKey,
        value: any
    ): void {

        setMetadata(this, prepareStaticMethodParam(this, target, name, index), key, value);
    }

    public getClassMetadata(
        target: $Decorators.IClassCtor,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareClass(this, target).data, key);
    }

    public getConstructorParameterMetadata(
        target: $Decorators.IClassCtor,
        index: number,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareCtorParam(this, target, index), key);
    }

    public getMethodMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareMethod(this, target, name).data, key);
    }

    public getStaticMethodMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareStaticMethod(this, target, name).data, key);
    }

    public getAccessorMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareProperty(this, target, name), key);
    }

    public getStaticAccessorMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareStaticProperty(this, target, name), key);
    }

    public getPropertyMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareProperty(this, target, name), key);
    }

    public getStaticPropertyMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareStaticProperty(this, target, name), key);
    }

    public getMethodParameterMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareMethodParam(this, target, name, index), key);
    }

    public getStaticMethodParameterMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
        key: C.IMetadataKey
    ): any {

        return getMetadata(this, prepareStaticMethodParam(this, target, name, index), key);
    }

    public getClassMetadataKeys(
        target: $Decorators.IClassCtor,
    ): C.IMetadataKey[] {

        return Array.from(prepareClass(this, target).data.keys());
    }

    public getConstructorParameterMetadataKeys(
        target: $Decorators.IClassCtor,
        index: number,
    ): C.IMetadataKey[] {

        return Array.from(prepareCtorParam(this, target, index).keys());
    }

    public getMethodMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IMetadataKey[] {

        return Array.from(prepareMethod(this, target, name).data.keys());
    }

    public getStaticMethodMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IMetadataKey[] {

        return Array.from(prepareStaticMethod(this, target, name).data.keys());
    }

    public getAccessorMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IMetadataKey[] {

        return Array.from(prepareProperty(this, target, name).keys());
    }

    public getStaticAccessorMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IMetadataKey[] {

        return Array.from(prepareStaticProperty(this, target, name).keys());
    }

    public getPropertyMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IMetadataKey[] {

        return Array.from(prepareProperty(this, target, name).keys());
    }

    public getStaticPropertyMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IMetadataKey[] {

        return Array.from(prepareStaticProperty(this, target, name).keys());
    }

    public getMethodParameterMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
    ): C.IMetadataKey[] {

        return Array.from(prepareMethodParam(this, target, name, index).keys());
    }

    public getStaticMethodParameterMetadataKeys(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
    ): C.IMetadataKey[] {

        return Array.from(prepareStaticMethodParam(this, target, name, index).keys());
    }

    public deleteClassMetadata(
        target: $Decorators.IClassCtor,
        key: C.IMetadataKey
    ): void {

        prepareClass(this, target).data.delete(key);
    }

    public deleteConstructorParameterMetadata(
        target: $Decorators.IClassCtor,
        index: number,
        key: C.IMetadataKey
    ): void {

        prepareCtorParam(this, target, index).delete(key);
    }

    public deleteMethodMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): void {

        prepareMethod(this, target, name).data.delete(key);
    }

    public deleteStaticMethodMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): void {

        prepareStaticMethod(this, target, name).data.delete(key);
    }

    public deleteAccessorMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): void {

        prepareProperty(this, target, name).delete(key);
    }

    public deleteStaticAccessorMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): void {

        prepareStaticProperty(this, target, name).delete(key);
    }

    public deletePropertyMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): void {

        prepareProperty(this, target, name).delete(key);
    }

    public deleteStaticPropertyMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        key: C.IMetadataKey
    ): void {

        prepareStaticProperty(this, target, name).delete(key);
    }

    public deleteMethodParameterMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
        key: C.IMetadataKey
    ): void {

        prepareMethodParam(this, target, name, index).delete(key);
    }

    public deleteStaticMethodParameterMetadata(
        target: $Decorators.IClassCtor,
        name: C.IIdentityKey,
        index: number,
        key: C.IMetadataKey
    ): void {

        prepareStaticMethodParam(this, target, name, index).delete(key);
    }

    public metadata(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IGeneralDecorator {

        return this.createGeneralMetadataDecorator(key, value);
    }

    public createAccessorMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IMethodDecorator {

        return $DecoratorHelper.createAccessorDecorator((proto, name) => {
            this.setAccessorMetadata(proto.constructor, name, key, value);
        });
    }

    public createClassMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IClassDecorator {

        return $DecoratorHelper.createClassDecorator((ctor) => {
            this.setClassMetadata(ctor, key, value);
        });
    }

    public createConstructorParameterMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IConstructorParameterDecorator {

        return $DecoratorHelper.createConstructorParameterDecorator((ctor, index) => {
            this.setConstructorParameterMetadata(ctor, index, key, value);
        });
    }

    public createGeneralMetadataDecorator(
        key: C.IMetadataKey,
        value: any,
        positions?: Array<keyof $Decorators.IGeneralDecoratorProcessorSet>,
    ): $Decorators.IGeneralDecorator {

        if (!positions?.length) {

            positions = [
                'accessor', 'class', 'ctorParameter', 'method',
                'methodParameter', 'property', 'staticAccessor', 'staticMethod',
                'staticMethodParameter', 'staticProperty'
            ];
        }

        const decSet: $Decorators.IGeneralDecoratorProcessorSet = {};

        for (const k of positions) {

            switch (k) {
                case 'accessor':
                    decSet.accessor = (proto, name) => {
                        this.setAccessorMetadata(proto.constructor, name, key, value);
                    };
                    break;
                case 'class':
                    decSet.class = (ctor) => {
                        this.setClassMetadata(ctor, key, value);
                    };
                    break;
                case 'ctorParameter':
                    decSet.ctorParameter = (ctor, i) => {
                        this.setConstructorParameterMetadata(ctor, i, key, value);
                    };
                    break;
                case 'method':
                    decSet.method = (proto, n) => {
                        this.setMethodMetadata(proto.constructor, n, key, value);
                    };
                    break;
                case 'methodParameter':
                    decSet.methodParameter = (p, n, i) => {
                        this.setMethodParameterMetadata(p.constructor, n, i, key, value);
                    };
                    break;
                case 'property':
                    decSet.property = (p, n) => {
                        this.setPropertyMetadata(p.constructor, n, key, value);
                    };
                    break;
                case 'staticAccessor':
                    decSet.staticAccessor = (c, n) => {
                        this.setStaticAccessorMetadata(c, n, key, value);
                    };
                    break;
                case 'staticMethod':
                    decSet.staticMethod = (c, n) => {
                        this.setStaticMethodMetadata(c, n, key, value);
                    };
                    break;
                case 'staticMethodParameter':
                    decSet.staticMethodParameter = (c, n, i) => {
                        this.setStaticMethodParameterMetadata(c, n, i, key, value);
                    };
                    break;
                case 'staticProperty':
                    decSet.staticProperty = (c, n) => {
                        this.setStaticPropertyMetadata(c, n, key, value);
                    };
                    break;
                default:
                    throw new RangeError(`Invalid decoration position "${k}".`);
            }
        }

        return $DecoratorHelper.createGeneralDecorator(decSet);
    }

    public createMethodMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IMethodDecorator {

        return $DecoratorHelper.createMethodDecorator((proto, name) => {
            this.setMethodMetadata(proto.constructor, name, key, value);
        });
    }

    public createMethodParameterMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IMethodParameterDecorator {

        return $DecoratorHelper.createMethodParameterDecorator((proto, name, index) => {
            this.setMethodParameterMetadata(proto.constructor, name, index, key, value);
        });
    }

    public createPropertyMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IPropertyDecorator {

        return $DecoratorHelper.createPropertyDecorator((proto, name) => {
            this.setPropertyMetadata(proto.constructor, name, key, value);
        });
    }

    public createStaticAccessorMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IStaticMethodDecorator {

        return $DecoratorHelper.createStaticAccessorDecorator((ctor, name) => {
            this.setStaticAccessorMetadata(ctor, name, key, value);
        });
    }

    public createStaticMethodMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IStaticMethodDecorator {

        return $DecoratorHelper.createStaticMethodDecorator((ctor, name) => {
            this.setStaticMethodMetadata(ctor, name, key, value);
        });
    }

    public createStaticMethodParameterMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IStaticMethodParameterDecorator {

        return $DecoratorHelper.createStaticMethodParameterDecorator((ctor, name, index) => {
            this.setStaticMethodParameterMetadata(ctor, name, index, key, value);
        });
    }

    public createStaticPropertyMetadataDecorator(
        key: C.IMetadataKey,
        value: any
    ): $Decorators.IStaticPropertyDecorator {

        return $DecoratorHelper.createStaticPropertyDecorator((ctor, name) => {
            this.setStaticPropertyMetadata(ctor, name, key, value);
        });
    }

    public configureMetadata(key: C.IMetadataKey, opts: Partial<C.IMetadataOptions>): void {

        const $data = privData.get(this)!.metadata;
        const originOpts = getMetadataDefinition(this, key);

        for (const k of ['validator', 'onDuplicated', 'wrapper'] as const) {

            // @ts-ignore
            originOpts[k] = opts[k];
        }

        $data.set(key, originOpts);
    }

    public getConstructorParameterTypes(ctor: $Decorators.IClassCtor): C.IDesignType[] | null {

        return Reflect.getMetadata('design:paramtypes', ctor) ?? null;
    }

    public getMethodParameterTypes(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType[] | null {

        return Reflect.getMetadata('design:paramtypes', ctor.prototype, name) ?? null;
    }

    public getStaticMethodParameterTypes(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType[] | null {

        return Reflect.getMetadata('design:paramtypes', ctor, name) ?? null;
    }

    public getAccessorType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        return Reflect.getMetadata('design:type', ctor.prototype, name) ?? null;
    }

    public getStaticAccessorType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        return Reflect.getMetadata('design:type', ctor, name) ?? null;
    }

    public getAccessorParameterType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        const ret = Reflect.getMetadata('design:paramtypes', ctor.prototype, name);

        if (Array.isArray(ret)) {

            return ret[0];
        }

        return null;
    }

    public getStaticAccessorParameterType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        const ret = Reflect.getMetadata('design:paramtypes', ctor, name);

        if (Array.isArray(ret)) {

            return ret[0];
        }

        return null;
    }

    public getPropertyType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        return Reflect.getMetadata('design:type', ctor.prototype, name) ?? null;
    }

    public getStaticPropertyType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        return Reflect.getMetadata('design:type', ctor, name) ?? null;
    }

    public getMethodReturnType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        let ret = Reflect.getMetadata('design:returntype', ctor.prototype, name);

        if (ret === undefined) {

            ret = Reflect.hasMetadata('design:returntype', ctor.prototype, name) ? undefined : null;
        }

        return ret;
    }

    public getStaticMethodReturnType(
        ctor: $Decorators.IClassCtor,
        name: C.IIdentityKey,
    ): C.IDesignType | null {

        let ret = Reflect.getMetadata('design:returntype', ctor, name);

        if (ret === undefined) {

            ret = Reflect.hasMetadata('design:returntype', ctor, name) ? undefined : null;
        }

        return ret;
    }
}

export function createReflectManager(): C.IReflectManager {

    return new ReflectManager();
}
