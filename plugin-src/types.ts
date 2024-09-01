export type Mode = {
	modeId: string
	name: string
}

export type CollectionVariableValue = {
	id: string
	name: string
	type: VariableResolvedDataType
	values: {
		modeName: string
		value: any
	}[]
	modes: Mode[]
}[]

export type CollectionVariable = {
	collectionName: string
	variables: CollectionVariableValue
}[]
