<script>
import { ref } from 'vue';

export default {
    name: 'ImporterStepper',
    props: {
        currentStep: {
            type: Number,
            required: true,
        },
    },
    setup() {
        const steps = [
            { number: 1, label: 'Upload' },
            { number: 2, label: 'Verificação' },
            { number: 3, label: 'Conclusão' },
        ];

        return {
            steps,
        };
    },
};
</script>

<template>
    <div class="stepper">
        <div v-for="(step, index) in steps" :key="step.number" class="step-item" :class="{ active: currentStep >= step.number, completed: currentStep > step.number }">
            <div class="step-circle">
                <span v-if="currentStep > step.number">✓</span>
                <span v-else>{{ step.number }}</span>
            </div>
            <div class="step-label">{{ step.label }}</div>
            <div v-if="index < steps.length - 1" class="step-line" :class="{ active: currentStep > step.number }"></div>
        </div>
    </div>
</template>

<style scoped>
.stepper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    position: relative;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    z-index: 1;
}

.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #e5e7eb;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
    transition: all 0.3s;
}

.step-item.active .step-circle {
    background-color: var(--primary-color);
    color: white;
}

.step-item.completed .step-circle {
    background-color: #10b981;
}

.step-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

.step-item.active .step-label {
    color: #1f2937;
}

.step-line {
    position: absolute;
    top: 16px;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: #e5e7eb;
    z-index: -1;
    transform: translateY(-50%);
}

.step-line.active {
    background-color: #10b981;
}

.step-item:last-child .step-line {
    display: none;
}
</style>
