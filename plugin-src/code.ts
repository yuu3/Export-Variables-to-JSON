import { arrayToNestedObject } from "./lib"
import type { Mode } from "./types"

const VARIABLE_ALIAS = "VARIABLE_ALIAS"

const getCollections = async () => {
	const variablesCollections =
		await figma.variables.getLocalVariableCollections()

	return variablesCollections
}

const _getCollectionVariables = async () => {
	return await figma.variables.getLocalVariables()
}

const _findAiliasVariables = async (mode: Mode[], variable: VariableAlias) => {
	let variableId = variable.id
	let value: any = ""
	let modeName = ""
	let next = false

	do {
		const _variable = await figma.variables.getVariableById(variableId)

		if (!_variable) break

		const variableModeId = mode.find((m) => _variable.valuesByMode[m.modeId])

		if (!variableModeId) break

		const variableMode: any = _variable.valuesByMode[variableModeId.modeId]

		if (variableMode.id) variableId = variableMode.id

		if (variableMode.type !== VARIABLE_ALIAS) {
			next = false
		} else if (variableMode.r) {
			next = false
		} else {
			next = true
		}

		if (!next) {
			value = variableMode
			modeName = variableModeId.name
		}
	} while (next)

	return {
		value,
		modeName
	}
}

// モード毎の変数を取得
const _getVariablesByMode = async (
	collectionModes: Mode[],
	allModes: Mode[],
	variables: Variable[]
) => {
	const data = []

	for (const variable of variables) {
		const values = []

		for (const mode of collectionModes) {
			const _variable = variable.valuesByMode[mode.modeId]

			if (typeof _variable === "object" && "type" in _variable) {
				if (_variable.type === VARIABLE_ALIAS) {
					const ailiasVariable = await _findAiliasVariables(allModes, _variable)
					values.push({
						modeName: ailiasVariable.modeName,
						value: ailiasVariable.value
					})
				}
			} else {
				values.push({
					modeName: mode.name,
					value: _variable
				})
			}
		}

		data.push({
			id: variable.id,
			name: variable.name,
			type: variable.resolvedType,
			values,
			modes: collectionModes
		})
	}

	return data
}

figma.showUI(__html__, {
	height: 400
})

figma.on("run", async () => {
	const variableCollections =
		await figma.variables.getLocalVariableCollections()

	figma.ui.postMessage({
		type: "getVariableCollections",
		data: variableCollections.map((variableCollection) => {
			return {
				name: variableCollection.name,
				key: variableCollection.key
			}
		})
	})
})

figma.ui.onmessage = async (props) => {
	const content: {
		[key: string]: any
	} = {}
	const collections = await getCollections()
	const collectionVariables = await _getCollectionVariables()
	const collectionVariablesByMode = []

	for (const collection of collections) {
		const modeIds = collections.flatMap((collection) => collection.modes)
		const variables = collectionVariables.filter(
			(v) => v.variableCollectionId === collection.id
		)

		collectionVariablesByMode.push({
			key: collection.key,
			collectionName: collection.name,
			variables: await _getVariablesByMode(collection.modes, modeIds, variables)
		})
	}

	collectionVariablesByMode.map((collection) => {
		const unitCollection = props.collections.find((c: any) => c.key === collection.key)

		content[collection.collectionName] = arrayToNestedObject(
			collection.variables,
			unitCollection ? unitCollection.unit : ""
		)
	})

	figma.ui.postMessage({
		type: "downloadJSON",
		data: content
	})
}
