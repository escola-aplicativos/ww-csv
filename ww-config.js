export default {
    editor: {
        label: {
            en: 'CSV Importer',
        },
    },
    triggerEvents: [
        {
            name: 'onComplete',
            label: { en: 'On Complete' },
            event: { mappedData: [] }
        },
    ],
    properties: {
        columns: {
            label: { en: 'Columns to map' },
            type: 'Array',
            options: {
                item: {
                    type: 'Object',
                    options: {
                        item: {
                            label: {
                                label: { en: 'Label' },
                                type: 'Text',
                                defaultValue: '',
                                multiLang: true
                            },
                            value: {
                                label: { en: 'Value' },
                                type: 'Text',
                                defaultValue: ''
                            }
                        }
                    }
                }
            },
            defaultValue: [
                 { value: 'nome', label: { en: 'Nome' } },
                 { value: 'email', label: { en: 'Email' } },
                 { value: 'wid', label: { en: 'Whatsapp' } },
            ],
            bindable: true,
        },
        primaryColor: {
            label: { en: 'Primary Color' },
            type: 'Color',
            defaultValue: '#3b82f6',
            bindable: true,
        },
    },
};
