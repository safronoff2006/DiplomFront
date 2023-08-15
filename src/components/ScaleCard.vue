<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" style="zoom: 90%;">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="../assets/oil.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ title }}</q-item-label>
          <!-- <q-item-label caption>Subhead</q-item-label> -->
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div style="text-align: center">
            <!-- <img src="../assets/benzovoz.webp" style="height: 128px; width: 200px" /> -->

            <table>
              <tr>
                <td></td>
                <td>
                  <img v-show="perimeter[1] === '+'" src="img/hgreen.jpg" alt="+" />
                  <img v-show="perimeter[1] === '-'" src="img/hred.jpg" alt="-" />
                  <img v-show="perimeter[1] === '?'" src="img/hgray.jpg" alt="?" />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <img v-show="perimeter[2] === '+'" src="img/vgreen.jpg" alt="+" />
                  <img v-show="perimeter[2] === '-'" src="img/vred.jpg" alt="-" />
                  <img v-show="perimeter[2] === '?'" src="img/vgray.jpg" alt="?" />
                </td>
                <td>
                  <img src="../assets/benzovoz.webp" style="height: 128px; width: 200px" v-show="true" />
                  <img src="img/nocar.jpg" v-show="false" />
                </td>
                <td>
                  <img v-show="perimeter[3] === '+'" src="img/vgreen.jpg" alt="+" />
                  <img v-show="perimeter[3] === '-'" src="img/vred.jpg" alt="-" />
                  <img v-show="perimeter[3] === '?'" src="img/vgray.jpg" alt="?" />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <img v-show="perimeter[0] === '+'" src="img/hgreen.jpg" alt="+" />
                  <img v-show="perimeter[0] === '-'" src="img/hred.jpg" alt="-" />
                  <img v-show="perimeter[0] === '?'" src="img/hgray.jpg" alt="?" />
                </td>
              </tr>
              <tr>
                <td colspan="3" style="color: crimson; font-size: x-large; font-weight: bold;">
                  <div>{{ weight }}</div>
                </td>
              </tr>
            </table>

          </div>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCounterStore } from 'stores/store'
import { ScaleInfo } from 'src/boot/types'
export default defineComponent({
  name: 'ScaleCard',
  data() {
    return {
      store: useCounterStore(),
    }
  },
  props: {
    title: String,
    item: Object,
  },
  computed: {
    perimeter() {
      const item: ScaleInfo = <ScaleInfo>this.item
      return this.store.perimeters(item.name)
    },
    weight() {
      const item: ScaleInfo = <ScaleInfo>this.item
      return this.store.weight(item.name)
    }
  },
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 271px
</style>
