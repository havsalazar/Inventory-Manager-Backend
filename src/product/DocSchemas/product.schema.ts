export const FSProducts = {
    schema: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                code: { type: 'string' },
                name: { type: 'string' },
                reference: { type: 'string' },
                price: { type: 'number' },
                vatValue: { type: 'number' },
                vat: { type: 'boolean' },
                stockeable: { type: 'boolean' },
                isService: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                picture: { type: 'string' },
                stocks: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            quantity: { type: 'integer' },
                            label: { type: 'string' }
                        }
                    }
                }
            }
        }
    }
}
export const FSbody = {
    name: 'term',
    required: true,
    description: 'You could use this field to make a full text search in code,name and reference at the same time',
    type: 'string'

}
