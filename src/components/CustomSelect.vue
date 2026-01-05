<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
    name: 'CustomSelect',
    props: {
        modelValue: {
            type: [String, Number],
            default: '',
        },
        options: {
            type: Array,
            required: true,
            // Expects array of objects: { value: '', label: '' }
        },
        placeholder: {
            type: String,
            default: 'Select an option',
        },
        disabledOptions: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const isOpen = ref(false);
        const containerRef = ref(null);

        const toggleDropdown = () => {
            isOpen.value = !isOpen.value;
        };

        const selectOption = (value) => {
            if (props.disabledOptions.includes(value)) return;
            emit('update:modelValue', value);
            isOpen.value = false;
        };

        const handleClickOutside = (event) => {
            if (containerRef.value && !containerRef.value.contains(event.target)) {
                isOpen.value = false;
            }
        };

        onMounted(() => {
            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        const getLabel = (value) => {
            const option = props.options.find(opt => opt.value === value);
            return option ? option.label : props.placeholder;
        };

        return {
            isOpen,
            containerRef,
            toggleDropdown,
            selectOption,
            getLabel,
        };
    },
};
</script>

<template>
    <div class="custom-select-container" ref="containerRef">
        <!-- Trigger Button -->
        <div 
            class="select-trigger" 
            :class="{ 'is-open': isOpen, 'has-value': modelValue !== '' }"
            @click="toggleDropdown"
        >
            <span class="selected-text">{{ getLabel(modelValue) }}</span>
            <svg 
                class="arrow-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>

        <!-- Dropdown Menu -->
        <transition name="fade">
            <div v-if="isOpen" class="options-menu">
                <div 
                    v-for="option in options" 
                    :key="option.value"
                    class="option-item"
                    :class="{ 
                        'is-selected': modelValue === option.value,
                        'is-disabled': disabledOptions.includes(option.value)
                    }"
                    @click="selectOption(option.value)"
                >
                    <span class="option-label">{{ option.label }}</span>
                    <svg 
                        v-if="modelValue === option.value"
                        class="check-icon" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.custom-select-container {
    position: relative;
    width: 100%;
}

.select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.75rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 42px;
}

.select-trigger:hover {
    border-color: #cbd5e1;
}

.select-trigger.is-open {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.selected-text {
    font-size: 0.875rem;
    color: #334155;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.select-trigger:not(.has-value) .selected-text {
    color: #94a3b8;
}

.arrow-icon {
    width: 1rem;
    height: 1rem;
    color: #64748b;
    transition: transform 0.2s;
    flex-shrink: 0;
    margin-left: 0.5rem;
}

.select-trigger.is-open .arrow-icon {
    transform: rotate(180deg);
}

.options-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 50;
    max-height: 250px;
    overflow-y: auto;
    padding: 0.25rem;
}

.option-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: #334155;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: background-color 0.1s;
}

.option-item:hover {
    background-color: #f1f5f9;
}

.option-item.is-selected {
    background-color: #eff6ff;
    color: #3b82f6;
    font-weight: 500;
}

.option-item.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f9fafb;
    color: #94a3b8;
}

.option-item.is-disabled:hover {
    background-color: #f9fafb;
}

.check-icon {
    width: 1rem;
    height: 1rem;
    color: #3b82f6;
}

/* Scrollbar styling */
.options-menu::-webkit-scrollbar {
    width: 6px;
}

.options-menu::-webkit-scrollbar-track {
    background: transparent;
}

.options-menu::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease, transform 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
