<template>
  <q-layout view="hHr lpR fFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div style="font-size: 12px" v-html="titles" />
        </q-toolbar-title>

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

export default defineComponent({
  name: 'MainLayout',

  components: {},

  data() {
    return {
      store: useCounterStore(),
      rightDrawerOpen: false,
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
  },
})
</script>
