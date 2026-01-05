<script>
import { ref, computed } from 'vue';
import CustomSelect from './CustomSelect.vue';

export default {
    name: 'ImporterStepVerification',
    components: {
        CustomSelect,
    },
    props: {
        csvData: {
            type: Array,
            required: true,
        },
        requiredColumns: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['back', 'next'],
    setup(props, { emit }) {
        const ignoreHeader = ref(true);
        const columnMapping = ref({});

        const availableFields = computed(() => {
            return props.requiredColumns.map(col => ({
                value: col.value,
                label: wwLib.wwLang.getText(col.label)
            }));
        });

        const displayRows = computed(() => {
            if (!props.csvData || props.csvData.length === 0) return [];
            const start = ignoreHeader.value ? 1 : 0;
            return props.csvData.slice(start, start + 100);
        });

        const columns = computed(() => {
            if (!props.csvData || props.csvData.length === 0) return [];
            const firstRow = props.csvData[0];
            if (!firstRow) return [];
            
            return firstRow.map((_, index) => ({
                index,
                header: `Coluna ${index + 1}`
            }));
        });

        const missingFields = computed(() => {
            const mappedValues = Object.values(columnMapping.value);
            return availableFields.value.filter(field => !mappedValues.includes(field.value));
        });

        const isMappingComplete = computed(() => missingFields.value.length === 0);

        const getDisabledOptions = (currentIndex) => {
            // Get all selected values from other columns
            const otherSelectedValues = Object.entries(columnMapping.value)
                .filter(([index, _]) => parseInt(index) !== currentIndex)
                .map(([_, value]) => value);
            
            return otherSelectedValues;
        };

        const handleNext = () => {
            if (!isMappingComplete.value) return;
            
            emit('next', {
                mapping: JSON.parse(JSON.stringify(columnMapping.value)),
                ignoreHeader: ignoreHeader.value
            });
        };

        const totalRowsCount = computed(() => {
            if (!props.csvData) return 0;
            return ignoreHeader.value ? Math.max(0, props.csvData.length - 1) : props.csvData.length;
        });

        return {
            ignoreHeader,
            columnMapping,
            availableFields,
            displayRows,
            columns,
            handleNext,
            missingFields,
            isMappingComplete,
            getDisabledOptions,
            totalRowsCount,
        };
    },
};
</script>

<template>
    <div class="verification-container">
        <div class="controls-header">
            <div class="left-controls">
                <button class="btn btn-secondary" @click="$emit('back')">Voltar</button>
                <div class="next-wrapper">
                    <button 
                        class="btn btn-primary" 
                        @click="handleNext"
                        :disabled="!isMappingComplete"
                        :title="!isMappingComplete ? 'Mapeie todos os campos obrigatórios' : ''"
                    >
                        Próximo
                    </button>
                </div>
            </div>
            <div class="right-controls">
                <label class="toggle-switch">
                    <span>Ignorar cabeçalho</span>
                    <input type="checkbox" v-model="ignoreHeader">
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th v-for="col in columns" :key="col.index">
                            <div class="th-content">
                                <span class="col-name">{{ col.header }}</span>
                                <CustomSelect 
                                    v-model="columnMapping[col.index]" 
                                    :options="availableFields"
                                    :disabled-options="getDisabledOptions(col.index)"
                                    placeholder="Selecione..."
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in displayRows" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                            {{ cell }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="rows-count">
            <span>
                Total de linhas importadas: <strong>{{ totalRowsCount }}</strong>
            </span>
            <span v-if="!isMappingComplete" class="validation-text">
                Mapeie os campos: {{ missingFields.map(f => f.label).join(', ') }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.verification-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.left-controls {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 1px solid transparent;
}

.btn-secondary {
    background-color: white;
    border-color: #d1d5db;
    color: #374151;
}

.btn-secondary:hover {
    background-color: #f3f4f6;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--primary-color);
    filter: brightness(0.9);
}

.btn:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.7;
}

.btn:disabled:hover {
    background-color: #9ca3af;
}

.next-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.validation-text {
    font-size: 0.85rem;
    color: #ef4444;
    font-weight: 500;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
}

.toggle-switch {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: #4b5563;
}

.toggle-switch input {
    display: none;
}

.slider {
    position: relative;
    width: 40px;
    height: 20px;
    background-color: #ccc;
    border-radius: 20px;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked + .slider {
    background-color: var(--primary-color);
}

input:checked + .slider:before {
    transform: translateX(20px);
}

.table-wrapper {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 400px;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    border-right: 1px solid #f3f4f6;
}

th:last-child, td:last-child {
    border-right: none;
}

th {
    background-color: #f9fafb;
    vertical-align: top;
    position: sticky;
    top: 0;
    z-index: 10;
    min-width: 200px; /* Ensure columns have enough width */
}

.th-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.col-name {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    font-weight: 600;
}



td {
    font-size: 0.875rem;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
}

tr:hover td {
    background-color: #f9fafb;
}

tr:last-child td {
    border-bottom: none;
}

.rows-count {
    text-align: right;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
}
</style>
