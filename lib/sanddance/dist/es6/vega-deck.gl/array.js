// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
export function concat(...args) {
    return args.reduce((p, c) => c ? p.concat(c) : p, []);
}
