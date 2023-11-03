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

export interface ICommandConfig {

    /**
     * The full name of sub command.
     *
     * > The name is case-insensitive by default.
     *
     * @format `/^[a-z][-a-z0-9]+$/i`
     */
    name: string;

    /**
     * The description of sub command, displayed in help.
     */
    description?: string;

    /**
     * The shortcut of sub command.
     *
     * > The shortcut is case-sensitive by default.
     *
     * @format `/^[a-z][-a-z0-9]+$/i`
     */
    shortcut?: string;

    /**
     * Minimum quantity of arguments.
     *
     * @default 0
     */
    minArguments?: number;

    /**
     * When a maximum quantity of arguments is set, the arguments after the one will be treat as tailing arguments.
     *
     * > Pass `-1` as unlimited.
     *
     * @default -1
     */
    maxArguments?: number;
}

export interface IFlagConfig {

    /**
     * The full name of a flag.
     *
     * @format /^[a-z][-a-z0-9]+$/i
     */
    name: string;

    /**
     * The description of flag, displayed in help.
     */
    description?: string;

    /**
     * The single-character shortcut of this flag.
     *
     * @format /^[A-Za-z0-9]$/
     */
    shortcut?: string;
}

export interface IOptionConfig {

    /**
     * The full name of an option.
     *
     * @format /^[a-z][-a-z0-9]+$/i
     */
    name: string;

    /**
     * The description of option, displayed in help.
     */
    description?: string;

    /**
     * The single-character shortcut of this option.
     *
     * @format /^[A-Za-z]$/
     */
    shortcut?: string;

    /**
     * The parent command path of this option.
     *
     * > e.g.
     * > - parent command path of option `--name` in `users create` should be `'users.create'`.
     * > - parent command path of top level option should be `''` or omitted.
     *
     * @format /^([a-z][-a-z0-9]+(\.[a-z][-a-z0-9]+)+)?$/i
     */
    parent?: string;

    /**
     * Allow use this option multiple times to receipt multiple arguments.
     *
     * > When set to `false`, only the last argument will be receipted.
     *
     * @default false
     */
    multiple?: boolean;
}

export interface IParseRuleBuilder {

    /**
     * Register a new sub command of current command.
     */
    addCommand(opts: ICommandConfig, processor?: (helper: IParseRuleBuilder) => void): this;

    /**
     * Register a new input option of current command.
     */
    addOption(opts: IOptionConfig): this;

    /**
     * Register a new input flag of current command.
     */
    addFlag(opts: IFlagConfig): this;

    /**
     * When a maximum quantity of arguments is set, the arguments after the one will be treat as tailing arguments.
     * [Default: -1]
     *
     * > Pass `-1` as unlimited.
     *
     * @param qty The maximum quantity of arguments to be parsed.
     */
    setMaxArguments(qty: number): this;

    /**
     * Set a minimum quantity of arguments. [Default: 0]
     *
     * > Pass `0` as unlimited.
     *
     * @param qty The minimum quantity of arguments to be parsed.
     */
    setMinArguments(qty: number): this;

    /**
     * Start a building process of a sub command.
     */
    with(commandName: string, processor: (helper: IParseRuleBuilder) => void): this;
}

export interface IHelper extends IParseRuleBuilder {

    /**
     * Check if a parse result is a request of displaying help tips.
     *
     * @param result    The parse result.
     */
    isHelpRequest(result: IParseResult): boolean;

    /**
     * Generate the help text about the parse result.
     *
     * @throws `E.NO_SUCH_COMMAND` if required command for help does not exist.
     */
    generateHelpOutput(result?: IParseResult): string[];

    /**
     * Generate the error notices from the parser.
     *
     * @param e     The error thrown by method `parse` or `generateHelpOutput`.
     */
    generateErrorOutput(e: unknown): string[];

    /**
     * Parse the command line arguments into structured result.
     *
     * @param args  The command-line arguments after command name.
     */
    parse(args: string[]): IParseResult;

    /**
     * Do parsing and return the result or help/error tips on case.
     *
     * @param args  The command-line arguments after command name.
     */
    parseAndProcess(args: string[]): IParseResult | string[];
}

export interface IParserPreferences {

    /**
     * Disable delegated command `help subcommands`.
     *
     * @default false
     */
    disableHelpCommand: boolean;

    /**
     * Disable delegated flag `[subcommands] --help`.
     *
     * @default false
     */
    disableHelpFlag: boolean;

    /**
     * Disable delegated flag shortcut `[subcommands] -h`.
     *
     * @default false
     */
    disableHelpFlagShortcut: boolean;

    /**
     * Treat flags/options after arguments as arguments.
     *
     * @default false
     */
    disableFlagsAfterArguments: boolean;

    /**
     * Disable the option style of `-v<arg>`, while `v` is a shortcut.
     *
     * @default false
     */
    disableOptionAttachMode: boolean;

    /**
     * Disable the option style of `--option-name=<arg>`.
     *
     * > When disabled, the input will be treat as argument.
     *
     * @default false
     */
    disableOptionAssignMode: boolean;

    /**
     * Disable the option style of `--option-name <arg>`.
     *
     * @default false
     */
    disableOptionFollowMode: boolean;
}

export type ILangPackage = Record<string, string>;

export interface IHelperOptions {

    /**
     * Title of the CLI application to be printed in the first line of help.
     */
    title: string;

    /**
     * The CLI command entry.
     */
    command: string;

    /**
     * The CLI description.
     */
    description: string;

    /**
     * The preferences of parser.
     *
     * @see IParserPreferences
     */
    preferences?: Partial<IParserPreferences>;

    /**
     * The i18n language package of translations.
     *
     * @default ENGLISH_LANG_PACKAGE
     */
    languagePackage?: ILangPackage;
}

export interface IParseResult {

    /**
     * Tell if command line arguments are parsed successfully.
     */
    successful: boolean;

    /**
     * The commands parsed from input.
     */
    commands: string[];

    /**
     * A key-value object records the options parsed from input.
     *
     * The keys of the object are the full name of options, while the values are array of input of each option.
     */
    options: Record<string, string[]>;

    /**
     * A key-value object records the flags parsed from input.
     *
     * The keys of the object are the full name of flags, while the values are the times of flags appeared.
     */
    flags: Record<string, number>;

    /**
     * The arguments parsed from input.
     */
    arguments: string[];

    /**
     * The arguments after '--' parsed from input.
     */
    tailingArguments: string[];

    /**
     * Unknown flags parsed from input.
     */
    unknownFlags: string[];
}

export interface ISubCommandParsedResult extends IParseResult {

    name: string;
}
