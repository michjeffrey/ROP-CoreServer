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
import { ENGLISH_LANG_PACKAGE } from './EnglishLangPkg';
import { HelpGenerator } from './HelpGenerator';
import { ClapParser } from './Parser';
import { ParseRuleBuilder } from './ParseRuleBuilder';

class ClapHelper extends ParseRuleBuilder implements C.IHelper {

    private _helpGen: HelpGenerator;

    private _parser: ClapParser;

    public constructor(
        title: string,
        command: string,
        description: string,
        opts: C.IParserPreferences,
        private _lang: C.ILangPackage
    ) {

        super(opts, {
            name: command,
            description
        });

        this._helpGen = new HelpGenerator(
            title,
            command,
            opts,
            this._rules,
            this._lang
        );

        this._parser = new ClapParser(opts, this._rules, this._helpGen);
    }

    public isHelpRequest(result: C.IParseResult): boolean {

        return this._helpGen.isHelpRequest(result);
    }

    public generateHelpOutput(result?: C.IParseResult): string[] {

        return this._helpGen.generate(result);
    }

    public generateErrorOutput(e: unknown): string[] {

        return this._helpGen.generateErrorOutput(e);
    }

    public parseAndProcess(args: string[]): C.IParseResult | string[] {

        try {

            const result = this.parse(args);

            if (this.isHelpRequest(result)) {

                return this.generateHelpOutput(result);
            }

            return result;
        }
        catch (e: unknown) {

            return this.generateErrorOutput(e);
        }
    }

    public parse(args: string[]): C.IParseResult {

        return this._parser.parse(args);
    }
}

const DEFAULT_PREFERENCES: C.IParserPreferences = {
    'disableFlagsAfterArguments': false,
    'disableHelpCommand': false,
    'disableHelpFlag': false,
    'disableHelpFlagShortcut': false,
    'disableOptionAssignMode': false,
    'disableOptionAttachMode': false,
    'disableOptionFollowMode': false
};

export function createHelper(opts: C.IHelperOptions): C.IHelper {

    return new ClapHelper(
        opts.title,
        opts.command,
        opts.description,
        {
            ...DEFAULT_PREFERENCES,
            ...opts.preferences
        },
        opts.languagePackage ?? ENGLISH_LANG_PACKAGE
    );
}
