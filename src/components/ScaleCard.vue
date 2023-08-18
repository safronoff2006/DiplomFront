<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" :style="styleObject">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="/img/oil.webp" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label style="font-size: 16px;">{{ title }}</q-item-label>
          <!-- <q-item-label caption>{{ name }}</q-item-label> -->
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div style="text-align: center">
            <table>
              <tr>
                <td rowspan="3">
                  <div v-show="svetofor === 'R' || svetofor === 'G'">
                    <div v-show="!(typeScale === 'rail' || name.toLowerCase().includes('rail'))">
                      <img v-show="svetofor === 'R'" src="img/sfRed.jpg" alt="Красный"
                        style="height: 100px; margin-right: 20px;">
                      <img v-show="svetofor === 'G'" src="img/sfGreen.jpg" alt="Зеленый"
                        style="height: 100px; margin-right: 20px;">
                    </div>
                  </div>
                </td>
                <td></td>
                <td>
                  <div v-show="!(typeScale === 'rail' || name.toLowerCase().includes('rail'))">
                    <img v-show="perimeter[1] === '+'" src="img/hgreen.jpg" alt="+" />
                    <img v-show="perimeter[1] === '-'" src="img/hred.jpg" alt="-" />
                    <img v-show="perimeter[1] === '?'" src="img/hgray.jpg" alt="?" />
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>

                <td>
                  <div v-if="false">
                    <img v-show="perimeter[2] === '+'" src="img/vgreen.jpg" alt="+" />
                    <img v-show="perimeter[2] === '-'" src="img/vred.jpg" alt="-" />
                    <img v-show="perimeter[2] === '?'" src="img/vgray.jpg" alt="?" />
                  </div>
                </td>
                <td>
                  <img src="../assets/benzovoz.webp" style="height: 128px; width: 200px"
                    v-show="typeof weight === 'number' && typeScale === 'auto'" />
                  <img src="../assets/rail.webp" style="height: 128px; width: 200px"
                    v-show="typeof weight === 'number' && typeScale === 'rail'" />
                  <img src="img/nocar.jpg"
                    v-show="typeof weight == 'string' || typeof weight === 'undefined' || typeScale === undefined" />
                </td>
                <td>
                  <div v-if="false">
                    <img v-show="perimeter[3] === '+'" src="img/vgreen.jpg" alt="+" />
                    <img v-show="perimeter[3] === '-'" src="img/vred.jpg" alt="-" />
                    <img v-show="perimeter[3] === '?'" src="img/vgray.jpg" alt="?" />
                  </div>
                </td>
              </tr>
              <tr>

                <td></td>
                <td>
                  <div v-show="!(typeScale === 'rail' || name.toLowerCase().includes('rail'))">
                    <img v-show="perimeter[0] === '+'" src="img/hgreen.jpg" alt="+" />
                    <img v-show="perimeter[0] === '-'" src="img/hred.jpg" alt="-" />
                    <img v-show="perimeter[0] === '?'" src="img/hgray.jpg" alt="?" />
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="color: crimson; font-size: x-large; font-weight: bold;">
                  <div :style="{ 'padding-left': paddingWeight + 'px' }">{{ weight }}</div>
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
      styleObject: {
        zoom: 100 + '%',
        '-moz-transform': 'scale(1)'
      },

    }
  },
  props: {
    title: String,
    item: Object,
  },
  computed: {
    paddingWeight() {
      return this.typeScale === 'auto' && (this.svetofor === 'R' || this.svetofor === 'G') ? 70 : 0
    },
    perimeter() {
      const item: ScaleInfo = <ScaleInfo>this.item
      return this.store.perimeters(item.name)
    },
    weight() {
      const item: ScaleInfo = <ScaleInfo>this.item
      return this.store.weight(item.name)
    },
    typeScale() {
      const item: ScaleInfo = <ScaleInfo>this.item
      return this.store.typeScale(item.name)
    },
    name() {
      const item: ScaleInfo = <ScaleInfo>this.item
      return item.name
    },
    svetofor() {
      const item: ScaleInfo = <ScaleInfo>this.item
      return this.store.svetofor(item.name)
    }
  },

  created() {
    if (!localStorage.cardScale) localStorage.cardScale = 90

    this.styleObject.zoom = localStorage.cardScale + '%'
    const mscale = Number((Number(localStorage.cardScale) / 100).toFixed(2))
    this.styleObject['-moz-transform'] = 'scale(' + mscale + ')'

    this.$bus.on('scale-update', () => {
      this.styleObject.zoom = localStorage.cardScale + '%'
      const mscale = Number((Number(localStorage.cardScale) / 100).toFixed(2))
      this.styleObject['-moz-transform'] = 'scale(' + mscale + ')'
    })
  },

  beforeUnmount() {
    this.$bus.off('scale-update')
  },

})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 360px
</style>
