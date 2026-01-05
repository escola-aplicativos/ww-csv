<script>
import { ref, computed } from 'vue';

export default {
    name: 'ImporterStepConclusion',
    props: {
        csvData: {
            type: Array,
            required: true,
        },
        columnMapping: {
            type: Object,
            required: true,
        },
        ignoreHeader: {
            type: Boolean,
            default: false,
        },
        requiredColumns: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['reset', 'back', 'complete'],
    setup(props) {
        const searchQuery = ref('');

        const fieldLabels = computed(() => {
            const labels = {};
            if (props.requiredColumns) {
                props.requiredColumns.forEach(col => {
                    labels[col.value] = wwLib.wwLang.getText(col.label);
                });
            }
            return labels;
        });

        const mappedHeaders = computed(() => {
            return Object.values(props.columnMapping).map(value => ({
                key: value,
                label: fieldLabels.value[value] || value
            }));
        });

        const processedRows = computed(() => {
            if (!props.csvData) return [];
            const start = props.ignoreHeader ? 1 : 0;
            const data = props.csvData.slice(start);
            
            return data.map(row => {
                const mappedRow = {};
                Object.entries(props.columnMapping).forEach(([colIndex, fieldKey]) => {
                    mappedRow[fieldKey] = row[colIndex];
                });
                return mappedRow;
            });
        });

        const filteredRows = computed(() => {
            if (!searchQuery.value) return processedRows.value;
            
            const query = searchQuery.value.toLowerCase();
            return processedRows.value.filter(row => {
                return Object.values(row).some(val => 
                    String(val).toLowerCase().includes(query)
                );
            });
        });

        return {
            searchQuery,
            mappedHeaders,
            filteredRows,
        };
    },
};
</script>

<template>
    <div class="conclusion-container">
        <div class="header-actions">
            <button class="btn btn-secondary" @click="$emit('back')">Voltar</button>
            <button class="btn btn-primary" @click="$emit('complete')">Completar importação</button>
        </div>

        <div class="search-wrapper">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Pesquisar..." 
                class="search-input"
            />
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th v-for="header in mappedHeaders" :key="header.key">
                            {{ header.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in filteredRows" :key="index">
                        <td v-for="header in mappedHeaders" :key="header.key">
                            {{ row[header.key] }}
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="filteredRows.length === 0" class="empty-state">
                Nenhum resultado encontrado.
            </div>
        </div>
    </div>
</template>

<style scoped>
.conclusion-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
}

.header-actions {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 0.625rem 1.25rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.btn-secondary {
    background-color: white;
    border-color: #e5e7eb;
    color: #374151;
}

.btn-secondary:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--primary-color);
    filter: brightness(0.9);
}

.search-wrapper {
    width: 100%;
    max-width: 400px;
}

.search-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #1f2937;
    outline: none;
    transition: border-color 0.2s;
}

.search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-container {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow-x: auto;
    overflow-y: auto;
    background-color: white;
    max-height: 400px; /* Adjust this value as needed */
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

th {
    background-color: #f9fafb;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #6b7280;
    font-weight: 600;
    letter-spacing: 0.05em;
    position: sticky;
    top: 0;
}

td {
    font-size: 0.875rem;
    color: #374151;
}

tr:last-child td {
    border-bottom: none;
}

tr:hover td {
    background-color: #f9fafb;
}

.empty-state {
    padding: 3rem;
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
}
</style>
