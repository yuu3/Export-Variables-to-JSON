export type Collection = {
  key: string
  name: string
  count: number
  unit: string
  isInclude: boolean
  types: {
    name: string
    count: number
  }[]
}
