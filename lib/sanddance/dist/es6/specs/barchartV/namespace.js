// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
export class NameSpace {
    constructor(nameSpace = '') {
        ['bucket', 'stacked', '__compartment', '__level'].forEach(name => {
            this[name] = `${name}${nameSpace}`;
        });
    }
}
