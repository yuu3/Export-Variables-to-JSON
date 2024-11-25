export type CollectionNameSpace = "color" | "spacing" | "radius"

export type Collection = {
  key: string
  name: string
  count: number
  unit: string
  isInclude: boolean
  nameSpace: CollectionNameSpace
  types: {
    name: string
    count: number
  }[]
}

export type Mode = {
	modeId: string
	name: string
}

export type CollectionVariableValue = {
	id: string
	name: string
	type: VariableResolvedDataType
	value: string | number | boolean | RGB | RGBA
	mode: Mode
}[]

export type CollectionVariable = {
	collectionName: string
	variables: CollectionVariableValue
}[]

export type CollectionOptions = {
	type: string
	separateFile: boolean
}
