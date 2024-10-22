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
