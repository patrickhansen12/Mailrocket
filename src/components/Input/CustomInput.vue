<template>
  <div class="custom-input-container" :class="status">
    <div class="input-wrapper">
      <font-awesome-icon
          :icon="currentIcon"
          class="status-icon"
      />
      <input
          v-model="inputValue"
          @input="validateInput"
          :placeholder="placeholder"
          class="input-field"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFaceSmile, faFaceSmileWink, faFaceSadTear } from '@fortawesome/free-regular-svg-icons'

const props = defineProps({
  placeholder: String,
  modelValue: String,
  valid: Boolean,
  invalid: Boolean
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue || '')
const status = ref('standard')

const currentIcon = computed(() => {
  if (status.value === 'valid') return faFaceSmileWink
  if (status.value === 'invalid') return faFaceSadTear
  return faFaceSmile
})

watch(inputValue, (newVal) => {
  emit('update:modelValue', newVal)
  validateInput()
})

const validateInput = () => {
  if (inputValue.value === '') {
    status.value = 'standard'
  } else if (props.valid) {
    status.value = 'valid'
  } else if (props.invalid) {
    status.value = 'invalid'
  } else {
    status.value = 'standard'
  }
}
</script>

<style lang="scss" scoped>
.custom-input-container {
  --border-color: #ccc;
  --border-color-valid: #28a745;
  --border-color-invalid: #dc3545;
  --icon-color: #666;
  --icon-color-valid: #28a745;
  --icon-color-invalid: #dc3545;

  &.valid {
    --border-color: var(--border-color-valid);
    --icon-color: var(--icon-color-valid);
  }

  &.invalid {
    --border-color: var(--border-color-invalid);
    --icon-color: var(--icon-color-invalid);
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: var(--border-color);
    box-shadow: 0 0 0 2px blue;
  }
}

.status-icon {
  padding: 0 12px;
  color: var(--icon-color);
  font-size: 1.2rem;
}

.input-field {
  flex: 1;
  padding: 10px 12px 10px 0;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;

  &::placeholder {
    color: #999;
  }
}
</style>