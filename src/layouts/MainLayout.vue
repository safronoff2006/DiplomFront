<template>
  <q-layout view="hHr lpR fFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div style="font-size: 12px" v-html="titles" />
        </q-toolbar-title>

        <label>Масштаб %</label>
        <vue-number-input v-model="cardScale" :min="40" :max="120" :step="10" inline center controls size="small"
          style="margin-left: 10px;margin-right: 20px;" @update:model-value="onCardScaleUpdate"></vue-number-input>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" behavior="mobile" side="right" @click="toggleRightDrawer" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCounterStore } from 'stores/store'
import VueNumberInput from '@chenfengyuan/vue-number-input'

export default defineComponent({
  name: 'MainLayout',

  components: { VueNumberInput },

  data() {
    return {
      store: useCounterStore(),
      rightDrawerOpen: false,
      cardScale: 90
    }
  },

  computed: {
    titles() {
      return this.store.titles
    },
  },

  methods: {
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen
    },

    onCardScaleUpdate(newValue: number) {
      console.log(newValue)
      localStorage.cardScale = newValue

      this.$bus.emit('scale-update')
    }
  },

  created() {
    if (localStorage.cardScale) {
      this.cardScale = Number(localStorage.cardScale)
    } else {
      localStorage.cardScale = 90
      this.cardScale = Number(localStorage.cardScale)
    }
  },




})
</script>
