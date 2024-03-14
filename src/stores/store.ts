import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { State, ScaleInfo, StateExist, StateNone, Perimeters, Protokol } from 'boot/types'
import { AxiosResponse } from 'axios'
import ReconnectingWebSocket from 'reconnecting-websocket'



export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0, // учебное
    platformList: [] as string[],
    validNames: [] as string[],
    scalesState: [] as Readonly<State>[],
    protocol: {} as Protokol,
    websocket: {} as ReconnectingWebSocket,
    connectionOpen: false,
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
        } else return undefined
      } else return undefined
    },

    svetofor: (state): (name: string) => string | undefined => (name: string) => {
      const stat: Readonly<State> | undefined = state.scalesState.find(x => x.name == name)
      if (stat) {
        const st: StateExist | StateNone = stat.state
        if ('svetofor' in st) {
          return st.svetofor
        } else return undefined
      } else return undefined
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
          console.log(this.scalesState)
        })
        .catch((err) => console.error(err))
    },


    messageWork(mess: string) {
      console.log(mess)

      const obj = JSON.parse(mess)

      if ('message' in obj) {

        const message = obj.message

        const perimeters: Perimeters = 'perimeters' in message ? {
          in: <string>message.perimeters.charAt(0),
          out: <string>message.perimeters.charAt(1),
          left: <string>message.perimeters.charAt(2),
          right: <string>message.perimeters.charAt(3)
        } : {
          in: '?',
          out: '?',
          left: '?',
          right: '?'
        }



        const innerState: StateExist = {
          weight: <number>Number(message.weight.trim()),
          type: message.prefix == '=' ? 'rail' : 'auto',
          perimeters: perimeters,
          svetofor: 'svetofor' in message ? <string>message.svetofor : '?'
        }


        const state: State = {
          name: <string>obj.name,
          indx: <number>obj.indx,
          humanName: 'humanName' in obj ? <string>obj.humanName : '',
          state: innerState,
        }


        const index = this.scalesState.findIndex(x => x.name == state.name)

        if (index >= 0) {
          this.scalesState[index] = state
        } else {
          this.scalesState.push(state)
        }


      }
    },

    webSocketInit() {
      console.log('WebSocket Init')

      if (!this.connectionOpen) {
        setInterval(() => this.getStates(), 250)
      }

    },

    async init(params: object) {

      const resp: void | AxiosResponse = await api.get('getProtokolConfig').catch(
        err => console.error(err)
      )

      if (resp) {
        const protokol: Protokol = resp.data
        console.log(protokol)
        this.protocol = protokol
      }

      const options = {
        connectionTimeout: 1000,
        maxRetries: 10,
      }

      api
        .get('getValidNames')
        .then((resp) => {
          this.validNames = resp.data
          let protokolname = 'Http'
          if ('protokol' in this.protocol) {
            protokolname = this.protocol.protokol
          }

          switch (protokolname) {
            case 'Http':
              setInterval(() => this.getStates(), 250)
              break

            case 'WebSocket':
              const websocket = new ReconnectingWebSocket(this.protocol.endPoint)
              this.websocket = websocket
              break

            case 'Any':
              const websocket2 = new ReconnectingWebSocket(this.protocol.endPoint, [], options)
              this.websocket = websocket2
              setTimeout(this.webSocketInit, 5000)
              break

            default:
              break
          }


          if ('url' in this.websocket) {
            console.log(this.websocket)
            this.websocket.onopen = event => {
              console.log('onopen', event)
              this.connectionOpen = true
            }

            this.websocket.onclose = event => {
              console.log('onclose', event)
              this.connectionOpen = false
            }

            this.websocket.onerror = event => console.error(event)


            this.websocket.onmessage = event => {
              const message = event.data
              console.log(message)
              this.messageWork(message)
            }

          }



        })
        .catch((err) => console.error(err))

      if ('scales' in params) {
        const scales: string = params.scales as string
        this.platformList = scales.split(',')
      }
    },
  },
})
