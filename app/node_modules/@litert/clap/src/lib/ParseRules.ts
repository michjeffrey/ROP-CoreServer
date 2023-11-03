/**
 *  Copyright 2021 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as C from './Common';
import * as E from './Errors';
import * as _ from './Utils';

export enum EFlagType {
    FLAG,
    OPTION
}

export class ParseRulesVessel {

    private _flagLikeEntries: Record<string, EFlagType> = {};

    private _flagLikeShortcut2Name: Record<string, string> = {};

    private _cmdShortcut2Name: Record<string, string> = {};

    private _flags: Record<string, C.IFlagConfig> = {};

    private _options: Record<string, C.IOptionConfig> = {};

    private _commands: Record<string, ParseRulesVessel> = {};

    public readonly info: Required<C.ICommandConfig>;

    public constructor(
        /**
         * The config of command bound with current rules vessel.
         */
        info: C.ICommandConfig,
        public readonly parent?: ParseRulesVessel,
    ) {

        this.info = {
            name: info.name,
            description: info.description ?? '',
            shortcut: info.shortcut ?? '',
            maxArguments: info.maxArguments ?? -1,
            minArguments: info.minArguments ?? 0
        };
    }

    public get isCommandMode(): boolean {

        return Object.keys(this._commands).length > 0;
    }

    public get countOptions(): number {

        return Object.keys(this._options).length + (this.parent?.countOptions ?? 0);
    }

    public get countFlags(): number {

        return Object.keys(this._flags).length + (this.parent?.countFlags ?? 0);
    }

    public get isRoot(): boolean {

        return !this.parent;
    }

    public getCommandNames(): string[] {

        return Object.keys(this._commands);
    }

    public getOptionNames(): string[] {

        const ret: string[] = [];

        if (this.parent) {

            ret.push(...this.parent.getOptionNames());
        }

        ret.push(...Object.keys(this._options));

        return ret;
    }

    public getFlagNames(): string[] {

        const ret: string[] = [];

        if (this.parent) {

            ret.push(...this.parent.getFlagNames());
        }

        ret.push(...Object.keys(this._flags));

        return ret;
    }

    protected _toIndexFlagName(name: string): string {

        if (name.length === 1) {

            return name;
        }

        return name.toLowerCase();
    }

    protected _toIndexCommandName(name: string): string {

        return name.toLowerCase();
    }

    public existCommand(name: string): boolean {

        name = this._toIndexCommandName(name);

        return !!this._commands[this._cmdShortcut2Name[name] ?? name];
    }

    public existOption(name: string): boolean {

        name = this._toIndexFlagName(name);

        return this._flagLikeEntries[name] === EFlagType.OPTION || !!this.parent?.existOption(name);
    }

    public existFlag(name: string): boolean {

        name = this._toIndexFlagName(name);

        return this._flagLikeEntries[name] === EFlagType.FLAG || !!this.parent?.existFlag(name);
    }

    public getCommandRules(name: string): ParseRulesVessel {

        name = this._toIndexCommandName(name);

        if (this.isUnusedCommandNameOrShortcut(name)) {

            throw new E.E_NO_SUCH_COMMAND({ name });
        }

        return this._commands[this._cmdShortcut2Name[name] ?? name];
    }

    public getOption(name: string): C.IOptionConfig {

        name = this._toIndexFlagName(name);

        if (!this.existOption(name) && !this.parent) {

            throw new E.E_NO_SUCH_OPTION({ name });
        }

        return this._options[this._flagLikeShortcut2Name[name] ?? name] ?? this.parent?.getOption(name);
    }

    public getFlag(name: string): C.IFlagConfig {

        name = this._toIndexFlagName(name);

        if (!this.existFlag(name) && !this.parent) {

            throw new E.E_NO_SUCH_FLAG({ name });
        }

        return this._flags[this._flagLikeShortcut2Name[name] ?? name] ?? this.parent?.getFlag(name);
    }

    /**
     * Tell if a name or shortcut for command is usable or not.
     */
    public isUnusedCommandNameOrShortcut(name: string): boolean {

        name = this._toIndexCommandName(name);

        return !this._commands[this._cmdShortcut2Name[name] ?? name];
    }

    /**
     * Tell if a name or shortcut for both flag and option is usable or not.
     */
    public isUnusedFlagLikeNameOrShortcut(name: string): boolean {

        name = this._toIndexFlagName(name);

        return this._flagLikeEntries[name] === undefined;
    }

    public addFlag(opts: C.IFlagConfig): void {

        const name = opts.name = this._toIndexFlagName(opts.name);
        const shortcut = opts.shortcut = opts.shortcut && this._toIndexFlagName(opts.shortcut);

        if (!_.isValidFlagName(name)) {

            throw new E.E_INVALID_FLAG_NAME({ name });
        }

        if (!this.isUnusedFlagLikeNameOrShortcut(name)) {

            throw new E.E_DUP_FLAG_NAME({ name });
        }

        if (shortcut) {

            if (!_.isValidFlagShortcut(shortcut)) {

                throw new E.E_INVALID_FLAG_SHORTCUT({ name, shortcut });
            }

            if (!this.isUnusedFlagLikeNameOrShortcut(shortcut)) {

                throw new E.E_DUP_FLAG_SHORTCUT({ name, shortcut });
            }

            this._flagLikeShortcut2Name[shortcut] = name;
            this._flagLikeEntries[shortcut] = EFlagType.FLAG;
        }

        this._flags[name] = opts;
        this._flagLikeEntries[name] = EFlagType.FLAG;
    }

    public addOption(opts: C.IOptionConfig): void {

        const name = opts.name = this._toIndexFlagName(opts.name);
        const shortcut = opts.shortcut = opts.shortcut && this._toIndexFlagName(opts.shortcut);

        if (!_.isValidFlagName(name)) {

            throw new E.E_INVALID_OPTION_NAME({ name });
        }

        if (!this.isUnusedFlagLikeNameOrShortcut(name)) {

            throw new E.E_DUP_OPTION_NAME({ name });
        }

        if (shortcut) {

            if (!_.isValidFlagShortcut(shortcut)) {

                throw new E.E_INVALID_OPTION_SHORTCUT({ name, shortcut });
            }

            if (!this.isUnusedFlagLikeNameOrShortcut(shortcut)) {

                throw new E.E_DUP_OPTION_SHORTCUT({ name, shortcut });
            }

            this._flagLikeShortcut2Name[shortcut] = name;
            this._flagLikeEntries[shortcut] = EFlagType.OPTION;
        }

        this._options[name] = opts;
        this._flagLikeEntries[name] = EFlagType.OPTION;
    }

    public addCommand(opts: C.ICommandConfig): void {

        const name = opts.name = this._toIndexCommandName(opts.name);
        const shortcut = opts.shortcut = opts.shortcut && this._toIndexCommandName(opts.shortcut);

        if (!_.isValidCommandName(name)) {

            throw new E.E_INVALID_COMMAND_NAME({ name });
        }

        if (!this.isUnusedCommandNameOrShortcut(name)) {

            throw new E.E_DUP_COMMAND_NAME({ name });
        }

        if (shortcut) {

            if (!_.isValidCommandShortcut(shortcut)) {

                throw new E.E_INVALID_COMMAND_SHORTCUT({ name, shortcut });
            }

            if (!this.isUnusedCommandNameOrShortcut(shortcut)) {

                throw new E.E_DUP_COMMAND_SHORTCUT({ name, shortcut });
            }

            this._cmdShortcut2Name[shortcut] = name;
        }

        this._commands[name] = new ParseRulesVessel(opts, this);
    }
}
