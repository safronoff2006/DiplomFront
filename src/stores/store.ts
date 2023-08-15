import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { State, ScaleInfo, StateExist, StateNone, Perimeters } from 'boot/types'


export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0, // учебное
    platformList: [] as string[],
    validNames: [] as string[],
    scalesState: [] as Readonly<State>[],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2, // учебный

    title:
      (state): ((name: string) => string | undefined) =>
        (name: string) =>
          state.scalesState.find((x) => x.name == name)?.humanName,

    titles: (state): string =>
      state.scalesState
        .sort((a, b) => (a.indx ?? 0) - (b.indx ?? 0))
        .map((x) => x.humanName)
        .join('<br>'),

    scalesInfo: (state): Readonly<ScaleInfo>[] =>
      state.scalesState
        .sort((a, b) => (a.indx ?? 0) - (b.indx ?? 0))
        .map(
          x => {
            return {
              indx: x.indx ?? 0,
              name: x.name,
              humanName: x.humanName
            } as Readonly<ScaleInfo>
          }),

    perimeters: (state): (name: string) => string => (name: string) => {
      const stat: Readonly<State> | undefined = state.scalesState.find(x => x.name == name)
      if (stat) {
        const st: StateExist | StateNone = stat.state
        if ('perimeters' in st) {
          const p: Perimeters = st.perimeters
          return p.in + p.out + p.left + p.right
        } else return '????'
      } else return '????'
    },

    weight: (state): (name: string) => number | ' ' | undefined => (name: string) => {
      const stat: Readonly<State> | undefined = state.scalesState.find(x => x.name == name)
      if (stat) {
        const st: StateExist | StateNone = stat.state
        if ('weight' in st) {
          return st.weight
        } else return ' '
      } else return ' '

    },

    typeScale: (state): (name: string) => string | undefined => (name: string) => {
      const stat: Readonly<State> | undefined = state.scalesState.find(x => x.name == name)
      if (stat) {
        const st: StateExist | StateNone = stat.state
        if ('type' in st) {
          return st.type
        } return undefined
      } return undefined
    }
  },
  actions: {
    increment() {
      // учебный
      this.counter++
    },

    getStates() {
      let respStr =
        this.platformList.length == 0 ? 'getAllStates' : 'getListStates?'

      let first = true
      this.platformList.forEach((pn) => {
        if (this.validNames.includes(pn)) {
          if (first) respStr = respStr + 'name=' + pn
          else respStr = respStr + '&name=' + pn
          first = false
        }
      })


      api
        .get(respStr)
        .then((resp) => {
          this.scalesState = resp.data.states
        })
        .catch((err) => console.error(err))
    },

    init(params: object) {
      api
        .get('getValidNames')
        .then((resp) => {
          this.validNames = resp.data
          setInterval(() => this.getStates(), 250)
        })
        .catch((err) => console.error(err))

      if ('scales' in params) {
        const scales: string = params.scales as string
        this.platformList = scales.split(',')
      }
    },
  },
})
