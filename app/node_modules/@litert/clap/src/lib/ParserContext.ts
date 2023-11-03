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
import { ParseRulesVessel } from './ParseRules';

export enum EParserStatus {

    IDLE,
    READING_COMMAND,
    READING_ARGUMENTS,
    READING_OPTION_ARG,
}

export class ParserContext {

    public status: EParserStatus = EParserStatus.IDLE;

    public data: Record<string, any> = {};

    public constructor(
        public rules: ParseRulesVessel,
        private _opts: C.IParserPreferences,
        public args: string[]
    ) {

        if (this.rules.isCommandMode) {

            this.status = EParserStatus.READING_COMMAND;
        }
        else {

            this.status = EParserStatus.READING_ARGUMENTS;
        }
    }

    private _result: C.IParseResult = {
        successful: false,
        commands: [],
        options: {},
        flags: {},
        arguments: [],
        tailingArguments: [],
        unknownFlags: []
    };

    public cursor: number = 0;

    public getCurrentPiece(): string {

        return this.args[this.cursor];
    }

    public end(): void {

        this.cursor = this.args.length;
    }

    public next(): boolean {

        return ++this.cursor < this.args.length;
    }

    public saveArgument(argument: string): void {

        if (this.rules.info.maxArguments !== -1 && this.countArguments() >= this.rules.info.maxArguments) {

            this._result.tailingArguments.push(argument);
        }
        else {

            this._result.arguments.push(argument);
        }
    }

    public saveTailingArguments(argument: string[]): void {

        this._result.tailingArguments.push(...argument);
    }

    public complete(): void {

        this._result.successful = true;
    }

    public getResult(): C.IParseResult {

        return this._result;
    }

    public saveOption(option: C.IOptionConfig, value: string): void {

        if (option.multiple) {

            this._result.options[option.name] = [
                ...(this._result.options[option.name] ?? []),
                value
            ];
        }
        else {

            this._result.options[option.name] = [value];
        }
    }

    public saveFlag(flag: C.IFlagConfig): void {

        this._result.flags[flag.name] = (this._result.flags[flag.name] ?? 0) + 1;

        if (flag.name.toLowerCase() === 'help' && !this._opts.disableHelpFlag) {

            this.end();
        }
    }

    public saveUnknownFlag(expr: string): void {

        if (!this._result.unknownFlags.includes(expr)) {

            this._result.unknownFlags.push(expr);
        }
    }

    public saveCommand(commandName: string): void {

        this.rules = this.rules.getCommandRules(commandName);
        this._result.commands.push(this.rules.info.name);
    }

    public resetStatus(): void {

        if (!this.rules.isCommandMode) {

            this.status = EParserStatus.READING_ARGUMENTS;
        }
    }

    public countArguments(): number {

        return this._result.arguments.length + this._result.tailingArguments.length;
    }
}
