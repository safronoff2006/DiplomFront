import { ExecSyncOptionsWithStringEncoding } from 'child_process'

console.log('Загружен types.ts')

export interface Perimeters {
  in: string
  out: string
  left: string
  right: ExecSyncOptionsWithStringEncoding
}

export interface StateExist {
  indx?: number
  type: string
  perimeters: Perimeters
  weight: number
}

export interface StateNone {
  none: string
  indx?: number
}

export interface State {
  indx?: number
  name: string
  humanName: string
  state: StateExist | StateNone
}

export interface ScaleInfo {
  indx: number
  name: string
  humanName: string
}
