<template>
  <q-page class="row justify-start" style="background-color: antiquewhite">
    <div v-for="item in scalesInfo" :key="item.name">
      <scale-card :title="item.humanName" :item="item" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCounterStore } from 'stores/store'
import ScaleCard from 'src/components/ScaleCard.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { ScaleCard },
  data() {
    return {
      store: useCounterStore(),
    }
  },
  computed: {
    count() {
      return this.store.counter
    },
    title() { // теst
      return this.store.title('TruckScale[1]')
    },

    titles() {
      return this.store.titles
    },

    scalesInfo() {
      return this.store.scalesInfo
    },
  },

  methods: {
    incrementCount() {
      this.store.increment()
    },
  },

  mounted() {
    this.store.init(this.$route.params)
  },
})
</script>
