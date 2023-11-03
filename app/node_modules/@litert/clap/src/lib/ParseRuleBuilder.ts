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

export class ParseRuleBuilder implements C.IParseRuleBuilder {

    public constructor(
        private _opts: C.IParserPreferences,
        info: C.ICommandConfig,
        protected _rules = new ParseRulesVessel(info, undefined)
    ) {

        if (!_opts.disableHelpFlag) {

            this.addFlag({
                'name': 'help',
                'shortcut': _opts.disableHelpFlagShortcut ? undefined : 'h',
            });
        }
    }

    public setMaxArguments(qty: number): this {

        this._rules.info.maxArguments = qty;
        return this;
    }

    public setMinArguments(qty: number): this {

        this._rules.info.minArguments = qty;
        return this;
    }

    public addCommand(opts: C.ICommandConfig, processor?: (helper: C.IParseRuleBuilder) => void): this {

        this._rules.addCommand(opts);

        if (
            !this._rules.parent
            && !this._rules.existCommand('help')
            && !this._opts.disableHelpCommand
        ) {

            this.addCommand({ name: 'help' });
        }

        return processor ? this.with(opts.name, processor) : this;
    }

    public addOption(opts: C.IOptionConfig): this {

        this._rules.addOption(opts);
        return this;
    }

    public addFlag(opts: C.IFlagConfig): this {

        this._rules.addFlag(opts);
        return this;
    }

    public with(command: string, cb: (helper: C.IParseRuleBuilder) => void): this {

        const cmd = this._rules.getCommandRules(command);

        cb(new ParseRuleBuilder(this._opts, cmd.info, cmd));
        return this;
    }
}
