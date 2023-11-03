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
import * as E from './Errors';
import * as _ from './Utils';
import { EParserStatus, ParserContext } from './ParserContext';
import { HelpGenerator } from './HelpGenerator';

export class ClapParser {

    public constructor(
        private _opts: C.IParserPreferences,
        private _rules: ParseRulesVessel,
        private _helpGen: HelpGenerator
    ) {}

    public parse(args: string[]): C.IParseResult {

        const ctx = new ParserContext(this._rules, this._opts, args);

        do {

            const p = ctx.getCurrentPiece();

            if (p === undefined) {

                break;
            }

            switch (ctx.status) {
                case EParserStatus.READING_COMMAND: {

                    if (
                        this._tryParseTailingArguments(p, ctx)
                        || this._tryParseOptionLongAssignMode(p, ctx)
                        || this._tryParseFlagLongMode(p, ctx)
                        || this._tryParseOptionShortAssignMode(p, ctx)
                        || this._tryParseOptionShortAttachMode(p, ctx)
                        || this._tryParseFlagShortMode(p, ctx)
                        || this._tryParseCommand(p, ctx)
                    ) {

                        break;
                    }

                    throw new E.E_COMMAND_REQUIRED();
                }
                case EParserStatus.READING_ARGUMENTS: {

                    if (this._tryParseTailingArguments(p, ctx)) {

                        break;
                    }

                    if (!this._opts.disableFlagsAfterArguments || !ctx.countArguments()) {

                        if (
                            this._tryParseOptionLongAssignMode(p, ctx)
                            || this._tryParseFlagLongMode(p, ctx)
                            || this._tryParseOptionShortAssignMode(p, ctx)
                            || this._tryParseOptionShortAttachMode(p, ctx)
                            || this._tryParseFlagShortMode(p, ctx)
                        ) {

                            break;
                        }
                    }

                    ctx.saveArgument(p);

                    break;
                }
                case EParserStatus.READING_OPTION_ARG: {

                    ctx.saveOption(ctx.rules.getOption(ctx.data.optionName), p);

                    ctx.resetStatus();
                    break;
                }
            }

        } while (ctx.next());

        if (!this._helpGen.isHelpRequest(ctx.getResult())) {

            switch (ctx.status) {
                case EParserStatus.READING_ARGUMENTS:

                    if (ctx.countArguments() < ctx.rules.info.minArguments) {

                        throw new E.E_ARGUMENTS_LACKED();
                    }

                    ctx.complete();
                    break;
                case EParserStatus.READING_COMMAND:
                    throw new E.E_COMMAND_REQUIRED();
                case EParserStatus.READING_OPTION_ARG:
                    throw new E.E_OPTION_VALUE_REQUIRED();
            }
        }

        return ctx.getResult();
    }

    private _tryParseCommand(piece: string, ctx: ParserContext): boolean {

        if (ctx.rules.existCommand(piece)) {

            ctx.saveCommand(piece);

            ctx.resetStatus();

            return true;
        }

        return false;
    }

    private _tryParseFlagShortMode(piece: string, ctx: ParserContext): boolean {

        if (_.isShortFlagMixedExpr(piece)) {

            const items = piece.slice(1).split('');

            const optNames = items.filter((v) => ctx.rules.existOption(v));

            if (optNames.length > 0 && this._opts.disableOptionFollowMode) {

                throw new E.E_OPTION_VALUE_REQUIRED({ option: `-${optNames[0]}` });
            }

            if (optNames.length > 1) {

                throw new E.E_OPTION_VALUE_REQUIRED({ input: `-${optNames[1]}` });
            }

            const flagNames = items.filter((v) => ctx.rules.existFlag(v));

            const unknownFlags = items.filter((v) => !optNames.includes(v) && !flagNames.includes(v));

            for (const i of flagNames) {

                ctx.saveFlag(ctx.rules.getFlag(i));
            }

            for (const i of unknownFlags) {

                ctx.saveUnknownFlag(`-${i}`);
            }

            if (optNames.length) {

                ctx.status = EParserStatus.READING_OPTION_ARG;
                ctx.data.optionName = optNames[0];
            }

            return true;
        }

        return false;
    }

    private _tryParseFlagLongMode(piece: string, ctx: ParserContext): boolean {

        if (_.isFullFlagExpr(piece)) {

            const name = piece.slice(2);

            if (ctx.rules.existOption(name)) {

                if (this._opts.disableOptionFollowMode) {

                    throw new E.E_OPTION_VALUE_REQUIRED({ input: piece });
                }

                ctx.status = EParserStatus.READING_OPTION_ARG;
                ctx.data.optionName = name;
            }
            else if (ctx.rules.existFlag(name)) {

                ctx.saveFlag(ctx.rules.getFlag(name));
            }
            else {

                ctx.saveUnknownFlag(piece);
            }

            return true;
        }

        return false;
    }

    private _tryParseOptionShortAttachMode(piece: string, ctx: ParserContext): boolean {

        if (
            _.isShortAttachLikeExpr(piece)
            && ctx.rules.existOption(piece[1])
            && !this._opts.disableOptionAttachMode
        ) {

            ctx.saveOption(ctx.rules.getOption(piece[1]), piece.slice(2));
            return true;
        }

        return false;
    }

    private _tryParseOptionShortAssignMode(piece: string, ctx: ParserContext): boolean {

        if (_.isShortAssignExpr(piece) && !this._opts.disableOptionAssignMode) {

            if (this._opts.disableOptionAssignMode) {

                ctx.saveArgument(piece);
                return true;
            }

            const name = piece[1];

            if (ctx.rules.existOption(name)) {

                ctx.saveOption(ctx.rules.getOption(name), piece.slice(3));
            }
            else {

                ctx.saveUnknownFlag(piece);
            }

            return true;
        }

        return false;
    }

    private _tryParseOptionLongAssignMode(piece: string, ctx: ParserContext): boolean {

        if (_.isFullAssignExpr(piece)) {

            if (this._opts.disableOptionAssignMode) {

                ctx.saveArgument(piece);
                return true;
            }

            const [name, value] = _.extractFullAssignExpr(piece);

            if (ctx.rules.existOption(name)) {

                ctx.saveOption(ctx.rules.getOption(name), value);
            }
            else {

                ctx.saveUnknownFlag(piece);
            }

            return true;
        }

        return false;
    }

    private _tryParseTailingArguments(piece: string, ctx: ParserContext): boolean {

        if (piece === '--') {

            ctx.saveTailingArguments(ctx.args.slice(ctx.cursor + 1));
            ctx.end();
            return true;
        }

        return false;
    }
}
