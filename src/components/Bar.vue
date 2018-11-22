<template>
  <div>
    <h1>bar</h1>
    <p>{{ appName }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'bar',
  computed: {
    ...mapState(['appName'])
  },
}
</script>

