<template>
  <div>
    <font-awesome-icon :icon="iconString" />
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon,
  },
  props: {
    iconString: String,
  },
};
</script>

<style scoped>
/* Tilføj eventuelle styles her */
</style>