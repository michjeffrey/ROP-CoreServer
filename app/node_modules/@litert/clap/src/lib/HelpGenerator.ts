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
import { ParseRulesVessel } from './ParseRules';

class ConsoleTextGenerator {

    private _lines: string[] = [];

    private _indentWidth = 0;

    private _indent = '';

    public indentIn(): void {

        this._indentWidth += 1;
        this._indent = '  '.repeat(this._indentWidth);
    }

    public indentOut(): void {

        this._indentWidth -= 1;

        if (this._indentWidth < 0) {

            this._indentWidth = 0;
        }

        this._indent = '  '.repeat(this._indentWidth);
    }

    public appendLine(...lines: string[]): void {

        lines = lines.map((v) => v.trimEnd()).filter((v) => v.length > 0);

        if (lines.length) {

            this._lines.push(...lines.map((v) => `${this._indent}${v}`));
        }
    }

    public appendEmptyLine(): void {

        this._lines.push('');
    }

    public getLines(): string[] {

        return [...this._lines];
    }
}

export class HelpGenerator {

    public constructor(
        private _title: string,
        private _command: string,
        private _opts: C.IParserPreferences,
        private _rules: ParseRulesVessel,
        private _lang: C.ILangPackage,
    ) {}

    public isHelpRequest(result: C.IParseResult): boolean {

        if (this._opts.disableHelpCommand && this._opts.disableHelpFlag) {

            return false;
        }

        return (!this._opts.disableHelpCommand && result.commands?.[0]?.toLowerCase() === 'help')
            || (!this._opts.disableHelpFlag && result.flags.help > 0);
    }

    private _orEmpty(cond: any, text: string): string {

        return cond ? text : '';
    }

    public generate(result?: C.IParseResult): string[] {

        const gen = new ConsoleTextGenerator();

        gen.appendLine(this._title);

        if (this._rules.isCommandMode) {

            const [cmd, rules] = this._prepareCommands(result);

            const cmdPath = cmd.replace(/ /g, ':');

            const prefix = cmdPath ? `cmd:${cmdPath}:` : 'cmd:';

            gen.appendLine(this._buildUsageLine([
                `${this._lang['help:usage']}:`,
                this._command,
                this._orEmpty(
                    this._rules.countFlags + this._rules.countOptions,
                    `[...${this._lang['help:usage:options']}]`
                ),
                cmd,
                this._orEmpty(
                    rules.isCommandMode,
                    this._lang['help:usage:command']
                ),
                this._orEmpty(
                    rules.countFlags + rules.countOptions,
                    `[...${this._lang['help:usage:sub-options']}]`
                ),
                this._orEmpty(
                    rules.info.maxArguments,
                    this._lang[`${prefix}arguments`] ?? this._lang['help:usage:arguments']
                ),
            ]));

            gen.appendEmptyLine();

            gen.appendLine(this._lang[`${prefix}desc`] ?? rules.info.description);

            if (rules.isCommandMode) {

                this._generateCommands(prefix, gen, rules);
            }

            if (rules.countFlags + rules.countOptions) {

                this._generateOptions(prefix, gen, rules);
            }
        }
        else {

            gen.appendLine(this._buildUsageLine([
                `${this._lang['help:usage']}:`,
                this._command,
                this._orEmpty(
                    this._rules.countFlags + this._rules.countOptions,
                    `[...${this._lang['help:usage:options']}]`
                ),
                this._orEmpty(
                    this._rules.info.maxArguments,
                    this._lang['help:usage:arguments']
                )
            ]));

            gen.appendEmptyLine();

            gen.appendLine(this._rules.info.description);

            if (this._rules.countFlags + this._rules.countOptions) {

                this._generateOptions(``, gen, this._rules);
            }
        }

        return gen.getLines();
    }

    private _generateCommands(prefix: string, gen: ConsoleTextGenerator, rules: ParseRulesVessel): void {

        gen.appendEmptyLine();

        gen.appendLine(`${this._lang['help:commands']}:`);

        gen.appendEmptyLine();

        gen.indentIn();

        const lines: Array<[string, string]> = [];

        for (const name of rules.getCommandNames().sort()) {

            const i = rules.getCommandRules(name).info;

            lines.push([
                i.shortcut ? `${i.name}, ${i.shortcut}` : `${i.name}`,
                (i.description || this._lang[`${prefix}${i.name}:desc`] || '').trim()
            ]);
        }

        const leftLength = Math.max(...lines.map((v) => v[0].length));

        for (const ln of lines) {

            if (/\r|\n/.test(ln[1])) {

                const [ln1, ...lns] = ln[1].split(/\r\n|\r|\n/);

                gen.appendLine(`${ln[0]}${ln1.padStart(ln1.length + 2 + leftLength - ln[0].length, ' ')}`);
                gen.appendLine(...lns.map((l) => l.padStart(l.length + 2 + leftLength, ' ')));
            }
            else {

                gen.appendLine(`${ln[0]}${ln[1].padStart(ln[1].length + 2 + leftLength - ln[0].length, ' ')}`);
            }
        }

        gen.indentOut();
    }

    private _generateOptions(prefix: string, gen: ConsoleTextGenerator, rules: ParseRulesVessel): void {

        gen.appendEmptyLine();

        gen.appendLine(`${this._lang['help:options']}:`);

        gen.appendEmptyLine();

        gen.indentIn();

        const lines: Array<[string, string]> = [];

        for (const name of Array.from(new Set([
            ...rules.getOptionNames(),
            ...rules.getFlagNames()
        ])).sort()) {

            if (rules.existFlag(name)) {

                const i = rules.getFlag(name);

                lines.push([
                    i.shortcut ? `-${i.shortcut}, --${i.name}` : `    --${i.name}`,
                    (i.description ?? this._lang[`${prefix}flags:${i.name}:desc`] ?? '').trim()
                ]);
            }
            else {

                const i = rules.getOption(name);

                const aName = this._lang[`${prefix}flags:${i.name}:argument`] ?? '<arg>';

                lines.push([
                    i.shortcut ? `-${i.shortcut}, --${i.name} ${aName}` : `    --${i.name} ${aName}`,
                    (i.description ?? this._lang[`${prefix}flags:${i.name}:desc`] ?? '').trim()
                ]);
            }
        }

        const leftLength = Math.max(...lines.map((v) => v[0].length));

        for (const ln of lines) {

            if (/\r|\n/.test(ln[1])) {

                const [ln1, ...lns] = ln[1].split(/\r\n|\r|\n/);

                gen.appendLine(`${ln[0]}${ln1.padStart(ln1.length + 2 + leftLength - ln[0].length, ' ')}`);
                gen.appendLine(...lns.map((l) => l.padStart(l.length + 2 + leftLength, ' ')));
            }
            else {

                gen.appendLine(`${ln[0]}${ln[1].padStart(ln[1].length + 2 + leftLength - ln[0].length, ' ')}`);
            }
        }

        gen.indentOut();
    }

    private _buildUsageLine(segs: string[]): string {

        return segs.filter((v) => v.length > 0).join(' ');
    }

    private _prepareCommands(result?: C.IParseResult): [string, ParseRulesVessel] {

        const validCmds: string[] = [];

        let cmds: string[] = [];

        let rules = this._rules;

        if (!result) {

            return ['', rules];
        }

        if (!this._opts.disableHelpCommand) {

            if (result.commands[0] === 'help') {

                cmds = result.arguments;
            }
            else {

                cmds = result.commands;
            }

            cmds = cmds.map((v) => v.toLowerCase()).filter((v) => v !== 'help');
        }

        for (const k of cmds) {

            if (rules.existCommand(k)) {

                rules = rules.getCommandRules(k);
                validCmds.push(rules.info.name);
            }
            else {

                throw new E.E_NO_SUCH_COMMAND({ name: k });
            }
        }

        return [validCmds.join(' '), rules];
    }

    public generateErrorOutput(e: unknown): string[] {

        const gen = new ConsoleTextGenerator();

        if (!E.errorRegistry.identify(e)) {

            gen.appendLine(`ERROR unknown: ${this._lang['errors.unknown']}`);
        }
        else {

            gen.appendLine(`ERROR ${e.name}: ${e.message}`);
        }

        if (!this._opts.disableHelpCommand && !this._opts.disableHelpFlag) {

            gen.appendEmptyLine();

            gen.appendLine(`${this._lang['errors.help.tips']}:`);

            gen.indentIn();

            if (!this._opts.disableHelpCommand && this._rules.isCommandMode) {

                gen.appendLine(`${this._command} help [...COMMAND]`);
            }
            else if (!this._opts.disableHelpFlag) {

                const cmd = this._rules.isCommandMode ? `${this._command} [...COMMAND]` : this._command;

                gen.appendLine(`${cmd} --help`);

                if (!this._opts.disableHelpFlagShortcut) {

                    gen.appendLine(`${cmd} -h`);
                }
            }

            gen.indentOut();
        }

        return gen.getLines();
    }
}
