import { DataNames, Other, FieldNames } from './constants';
export function topLookup(column, count) {
    const data = [
        {
            name: DataNames.TopLookup,
            source: DataNames.Main,
            transform: [
                { type: 'aggregate', groupby: [column.name] },
                {
                    type: 'window',
                    ops: [
                        'count'
                    ],
                    as: [
                        FieldNames.TopIndex
                    ]
                },
                { type: 'filter', expr: `datum.${FieldNames.TopIndex} <= ${count}` }
            ]
        },
        {
            name: DataNames.Legend,
            source: DataNames.Main,
            transform: [
                {
                    type: 'lookup',
                    from: DataNames.TopLookup,
                    key: column.name,
                    fields: [column.name],
                    values: [column.name],
                    as: [FieldNames.Top]
                },
                {
                    type: 'formula',
                    expr: `datum.${FieldNames.Top} == null ? '${Other}' : datum.${FieldNames.Top}`,
                    as: FieldNames.Top
                }
            ]
        }
    ];
    return data;
}
