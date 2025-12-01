<template>
  <div>

    <custom-input
        v-model="inputValue"
        placeholder="Skriv mindst 3 tegn"
        :valid="isValid"
        :invalid="isInvalid"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import CustomInput from '@/components/Input/CustomInput.vue'
import {
  faFaceSmile,
  faFaceSmileWink,
  faFaceSadTear
} from '@fortawesome/free-regular-svg-icons'

export default {
  name: 'SendMail',
  components: { CustomInput },

  data() {
    return {
      inputValue: ''
    }
  },

  computed: {
    isValid() {
      return this.inputValue.length >= 3
    },
    isInvalid() {
      return this.inputValue.length > 0 && this.inputValue.length < 3
    },
    icon() {
      if (this.isValid) return faFaceSmileWink
      if (this.isInvalid) return faFaceSadTear
      return faFaceSmile
    },
    statusClass() {
      if (this.isValid) return 'valid'
      if (this.isInvalid) return 'invalid'
      return 'neutral'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>