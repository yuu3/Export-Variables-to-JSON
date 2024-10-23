import { arrayToNestedObject } from "./lib"
import type { Mode } from "./types"

const VARIABLE_ALIAS = "VARIABLE_ALIAS"

const _findAiliasVariables = async (mode: Mode, collectionModes: Mode[], variable: VariableAlias) => {
	let variableId = variable.id
	let value: any = ""
	let next = false

	do {
		const _variable = await figma.variables.getVariableById(variableId)

		if (!_variable) break

		const variableMode = collectionModes.find((m) => !!_variable.valuesByMode[m.modeId])

		if (!variableMode) break

		const variable: any = _variable.valuesByMode[variableMode.modeId]

		if (variable.id) variableId = variable.id

		if (variable.type !== VARIABLE_ALIAS) {
			next = false
		} else if (variable.r) {
			next = false
		} else {
			next = true
		}

		if (!next) value = variable
	} while (next)

	return value
}

// モード毎の変数を取得
const _getVariablesByMode = async (
	mode: Mode,
	collectionModes: Mode[],
	variables: Variable[]
) => {
	const data = []

	for (const variable of variables) {
		let value: string | number | boolean | RGB | RGBA = ""
		const _variable = variable.valuesByMode[mode.modeId]

		if (typeof _variable === "object" && "type" in _variable) {
			if (_variable.type === VARIABLE_ALIAS) {
				const ailiasVariable = await _findAiliasVariables(mode, collectionModes, _variable)

				value = ailiasVariable
			}
		} else {
			value = _variable
		}

		data.push({
			id: variable.id,
			name: variable.name,
			type: variable.resolvedType,
			value,
			mode
		})
	}

	return data
}

figma.showUI(__html__, {
	height: 400
})

export const getCollections = async () => {
	const variableCollections =
		await figma.variables.getLocalVariableCollections()

	return variableCollections.map((variableCollection) => {
		return {
			name: variableCollection.name,
			key: variableCollection.key
		}
	})
}

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
	const collections = await figma.variables.getLocalVariableCollections()
	const collectionVariables = await figma.variables.getLocalVariables()
	const collectionModes = collections.map((collection) => collection.modes).flat()
	const collectionVariablesByMode = []

	for (const collection of collections) {
		const variables = collectionVariables.filter(
			(v) => v.variableCollectionId === collection.id
		)

		for (const mode of collection.modes) {
			const collectionName = () => {
				const modeCount = collection.modes.length

				return modeCount > 1 ? `${collection.name}/${mode.name}` : collection.name
			}

			collectionVariablesByMode.push({
				key: collection.key,
				collectionName: collectionName(),
				variables: await _getVariablesByMode(mode, collectionModes, variables),
				mode
			})
		}
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
