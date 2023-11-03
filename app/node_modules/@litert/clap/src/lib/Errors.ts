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

import * as $Exceptions from '@litert/exception';

export const errorRegistry = $Exceptions.createExceptionRegistry({
    'module': 'clap.litert.org',
    'types': {
        'prepare': {
            'index': $Exceptions.createIncreaseCodeIndex(1)
        },
        'runtime': {
            'index': $Exceptions.createIncreaseCodeIndex(1000)
        }
    }
});

export const E_NO_SUCH_COMMAND = errorRegistry.register({
    name: 'no_such_command',
    message: 'The command does not exist.',
    metadata: {},
    type: 'prepare'
});

export const E_NO_SUCH_OPTION = errorRegistry.register({
    name: 'no_such_option',
    message: 'The option does not exist.',
    metadata: {},
    type: 'prepare'
});

export const E_NO_SUCH_FLAG = errorRegistry.register({
    name: 'no_such_flag',
    message: 'The flag does not exist.',
    metadata: {},
    type: 'prepare'
});

export const E_DUP_OPTION_NAME = errorRegistry.register({
    name: 'dup_option_name',
    message: 'The name of option has already been used.',
    metadata: {},
    type: 'prepare'
});

export const E_DUP_COMMAND_NAME = errorRegistry.register({
    name: 'dup_command_name',
    message: 'The name of command has already been used.',
    metadata: {},
    type: 'prepare'
});

export const E_DUP_FLAG_NAME = errorRegistry.register({
    name: 'dup_flag_name',
    message: 'The name of flag has already been used.',
    metadata: {},
    type: 'prepare'
});

export const E_DUP_OPTION_SHORTCUT = errorRegistry.register({
    name: 'dup_option_shortcut',
    message: 'The shortcut of option has already been used.',
    metadata: {},
    type: 'prepare'
});

export const E_DUP_COMMAND_SHORTCUT = errorRegistry.register({
    name: 'dup_command_shortcut',
    message: 'The shortcut of command has already been used.',
    metadata: {},
    type: 'prepare'
});

export const E_DUP_FLAG_SHORTCUT = errorRegistry.register({
    name: 'dup_flag_shortcut',
    message: 'The shortcut of flag has already been used.',
    metadata: {},
    type: 'prepare'
});

export const E_INVALID_OPTION_NAME = errorRegistry.register({
    name: 'invalid_option_name',
    message: 'The name of option is malformed.',
    metadata: {},
    type: 'prepare'
});

export const E_INVALID_COMMAND_NAME = errorRegistry.register({
    name: 'invalid_command_name',
    message: 'The name of command is malformed.',
    metadata: {},
    type: 'prepare'
});

export const E_INVALID_FLAG_NAME = errorRegistry.register({
    name: 'invalid_flag_name',
    message: 'The name of flag is malformed.',
    metadata: {},
    type: 'prepare'
});

export const E_INVALID_OPTION_SHORTCUT = errorRegistry.register({
    name: 'invalid_option_shortcut',
    message: 'The shortcut of option is malformed.',
    metadata: {},
    type: 'prepare'
});

export const E_INVALID_COMMAND_SHORTCUT = errorRegistry.register({
    name: 'invalid_command_shortcut',
    message: 'The shortcut of command is malformed.',
    metadata: {},
    type: 'prepare'
});

export const E_INVALID_FLAG_SHORTCUT = errorRegistry.register({
    name: 'invalid_flag_shortcut',
    message: 'The shortcut of flag is malformed.',
    metadata: {},
    type: 'prepare'
});

export const E_OPTION_VALUE_REQUIRED = errorRegistry.register({
    name: 'option_value_required',
    message: 'The value of option is required.',
    metadata: {},
    type: 'runtime'
});

export const E_COMMAND_REQUIRED = errorRegistry.register({
    name: 'command_required',
    message: 'The command is required before arguments.',
    metadata: {},
    type: 'runtime'
});

export const E_ARGUMENTS_LACKED = errorRegistry.register({
    name: 'arguments_lacked',
    message: 'Too few arguments.',
    metadata: {},
    type: 'runtime'
});
