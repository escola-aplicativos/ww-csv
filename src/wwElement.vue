<template>
    <div class="importer-wrapper" :style="{ '--primary-color': content.primaryColor }">
        <div class="card">
            <ImporterStepper :current-step="currentStep" />
            
            <div class="step-content">
                <ImporterStepUpload 
                    v-if="currentStep === 1" 
                    @file-parsed="handleFileParsed" 
                />
                
                <ImporterStepVerification 
                    v-if="currentStep === 2" 
                    :csv-data="csvData"
                    :required-columns="content.columns"
                    @back="currentStep = 1"
                    @next="handleVerificationNext"
                />
                
                <ImporterStepConclusion 
                    v-if="currentStep === 3"
                    :csv-data="csvData"
                    :column-mapping="columnMapping"
                    :ignore-header="ignoreHeader"
                    :required-columns="content.columns"
                    @reset="handleReset"
                    @back="currentStep = 2"
                    @complete="handleComplete"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import ImporterStepper from './components/ImporterStepper.vue';
import ImporterStepUpload from './components/ImporterStepUpload.vue';
import ImporterStepVerification from './components/ImporterStepVerification.vue';
import ImporterStepConclusion from './components/ImporterStepConclusion.vue';

export default {
    name: 'CsvImporter',
    components: {
        ImporterStepper,
        ImporterStepUpload,
        ImporterStepVerification,
        ImporterStepConclusion,
    },
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const currentStep = ref(1);
        const csvData = ref([]);
        const columnMapping = ref({});
        const ignoreHeader = ref(false);

        // Expose mapped data as a component variable
        const { value: mappedData, setValue: setMappedData } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'mappedData',
            type: 'array',
            defaultValue: [],
            readonly: true,
        });

        // Compute the mapped data array
        const computeMappedData = () => {
            if (!csvData.value || !csvData.value.length || !columnMapping.value) {
                return [];
            }

            const startIndex = ignoreHeader.value ? 1 : 0;
            const dataRows = csvData.value.slice(startIndex);

            return dataRows.map(row => {
                const obj = {};
                Object.entries(columnMapping.value).forEach(([csvColumn, fieldName]) => {
                    const columnIndex = parseInt(csvColumn);
                    if (!isNaN(columnIndex) && row[columnIndex] !== undefined) {
                        let value = row[columnIndex];
                        
                        obj[fieldName] = value;
                    }
                });
                return obj;
            });
        };

        const handleFileParsed = (data) => {
            csvData.value = data;
            currentStep.value = 2;
        };

        const handleVerificationNext = (payload) => {
            columnMapping.value = payload.mapping;
            ignoreHeader.value = payload.ignoreHeader;
            currentStep.value = 3;

            // Compute and set the mapped data
            const mapped = computeMappedData();
            setMappedData(mapped);

            // Trigger the import event
            emit('trigger-event', {
                name: 'import',
                event: { 
                    data: csvData.value, 
                    mapping: columnMapping.value,
                    ignoreHeader: ignoreHeader.value,
                    mappedData: mapped,
                },
            });
        };

        const handleComplete = (payload) => {
             const mapped = payload || computeMappedData();
             
             emit('trigger-event', {
                name: 'onComplete',
                event: { 
                    mappedData: mapped,
                },
            });
        };

        const handleReset = () => {
            csvData.value = [];
            columnMapping.value = {};
            currentStep.value = 1;
            setMappedData([]);
        };

        return {
            currentStep,
            csvData,
            columnMapping,
            ignoreHeader,
            handleFileParsed,
            handleVerificationNext,
            handleReset,
            handleComplete,
        };
    },
};
</script>

<style lang="scss" scoped>
.importer-wrapper {
    width: 100%;
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 2rem;
    border: 1px solid #e5e7eb;
}

.step-content {
    min-height: 300px;
}
</style>
