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

export function isValidFlagName(token: string): boolean {

    return /^[a-z][-a-z0-9]+$/i.test(token);
}

export function isValidFlagShortcut(token: string): boolean {

    return /^[a-zA-Z]$/i.test(token);
}

export function isValidOptionShortcut(token: string): boolean {

    return /^[a-zA-Z]$/.test(token);
}

export function isValidCommandName(token: string): boolean {

    return /^[a-z][-a-z0-9]+$/i.test(token);
}

export function isValidCommandShortcut(token: string): boolean {

    return /^[a-z][-a-z0-9]*$/i.test(token);
}

export function isFullFlagExpr(token: string): boolean {

    return /^--[a-z][-a-z0-9]+$/i.test(token);
}

export function isShortFlagMixedExpr(token: string): boolean {

    return /^-[a-z]+$/i.test(token);
}

/**
 * Check if token matches `-n=value` pattern.
 */
export function isShortAssignExpr(token: string): boolean {

    return /^-[a-z]=.+$/i.test(token);
}

/**
 * Check if token matches `-n<arg>` pattern.
 */
export function isShortAttachLikeExpr(token: string): boolean {

    return /^-[a-z].+/i.test(token);
}

/**
 * Check if token matches `--name=value` pattern.
 */
export function isFullAssignExpr(token: string): boolean {

    return /^--[a-z][-a-z0-9]+=.+$/i.test(token);
}

export function extractFullAssignExpr(expr: string): string[] {

    const segs = expr.split('=');

    return [segs[0].slice(2), segs.slice(1).join('=')];
}
