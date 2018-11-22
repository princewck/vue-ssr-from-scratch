<template>
<div>
  <h1>Foo</h1>
  <div>{{ item.title }}</div>
</div>
</template>

<script>
export default {
  name: 'foo',
  asyncData ({ store, route }) {
    // is should be replaced with this.$route.params.id
    return store.dispatch('fetchItem', 1)
  },
  computed: {
    item() {
      return this.$store.state.items[1]
    }
  }
}
</script>

