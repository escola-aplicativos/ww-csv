<script>
import { ref } from 'vue';
import Papa from 'papaparse';

export default {
    name: 'ImporterStepUpload',
    emits: ['file-parsed'],
    setup(props, { emit }) {
        const fileInput = ref(null);
        const isDragging = ref(false);

        const handleFileUpload = (event) => {
            const target = event.target;
            if (target.files && target.files[0]) {
                parseFile(target.files[0]);
            }
        };

        const handleDrop = (event) => {
            isDragging.value = false;
            if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
                parseFile(event.dataTransfer.files[0]);
            }
        };

        const parseFile = (file) => {
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                Papa.parse(content, {
                    complete: (results) => {
                        emit('file-parsed', results.data);
                    },
                    header: false,
                    skipEmptyLines: true,
                });
            };
            reader.onerror = (err) => {
                console.error('Error reading file:', err);
            };
            reader.readAsText(file);
        };

        return {
            fileInput,
            isDragging,
            handleFileUpload,
            handleDrop,
        };
    },
};
</script>

<template>
    <div class="upload-container">
        <div 
            class="dropzone"
            :class="{ dragging: isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="fileInput?.click()"
        >
            <input 
                type="file" 
                ref="fileInput" 
                accept=".csv" 
                class="hidden-input" 
                @change="handleFileUpload"
            />
            <div class="dropzone-content">
                <div class="icon">📄</div>
                <h3>Clique ou arraste um arquivo CSV</h3>
                <p>Suporta arquivos .csv</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.upload-container {
    padding: 2rem;
    display: flex;
    justify-content: center;
}

.dropzone {
    width: 100%;
    max-width: 600px;
    height: 300px;
    border: 2px dashed #e5e7eb;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    background-color: #f9fafb;
}

.dropzone:hover, .dropzone.dragging {
    border-color: var(--primary-color);
    background-color: #eff6ff;
}

.dropzone-content {
    text-align: center;
}

.icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hidden-input {
    display: none;
}

h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-weight: 600;
}

p {
    margin: 0;
    color: #6b7280;
}
</style>
