import {
	arrayToNestedObject,
	convertToCSS
} from "./libs"
import type {
	Mode,
	Collection as TypeCollection,
	CollectionOptions
} from "./types"

export type TextLocalStyle = TextStyle
export type PaintLocalStyle = PaintStyle
export type EffectLocalStyle = EffectStyle
export type GridLocalStyle = GridStyle
export type Styles = {
	text: TextStyle[]
	fill: PaintStyle[]
	effect: EffectStyle[]
	grid: GridStyle[]
}

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
	width: 520,
	height: 520
})

figma.on("run", async () => {
	const collections = await figma.variables.getLocalVariableCollections()
	const variables = await figma.variables.getLocalVariables()
	const styles: Styles = {
		text: figma.getLocalTextStyles(),
		fill: figma.getLocalPaintStyles(),
		effect: figma.getLocalEffectStyles(),
		grid: figma.getLocalGridStyles()
	}

	figma.ui.postMessage({
		type: "getVariableCollections",
		data: collections.map((collection) => {
			const _variables = variables.filter(v => v.variableCollectionId === collection.id)
			const count = _variables.length
			const types = Array.from(new Set(_variables.map(v => v.resolvedType)))
			const typeCount = (typeName: string) => _variables.filter(v => v.resolvedType === typeName).length

			return {
				name: collection.name,
				key: collection.key,
				count,
				types: types.map((type) => ({
					name: type,
					count: typeCount(type)
				})),
				unit: "",
				nameSpace: "color",
				isInclude: true
			}
		})
	})

	figma.ui.postMessage({
		type: "getLocalStyles",
		data: {
			text: styles.text.map(style => ({
				id: style.id,
				name: style.name,
				description: style.description,
				fontName: style.fontName,
				fontSize: style.fontSize,
				letterSpacing: style.letterSpacing,
				lineHeight: style.lineHeight,
			})),
			fill: styles.fill.map(style => ({
				id: style.id,
				name: style.name,
				paints: style.paints.map(paint => ({
					blendMode: paint.blendMode,
					visible: paint.visible,
					type: paint.type,
					opacity: paint.opacity
				}))
			})),
			effect: styles.effect.map(style => ({
				id: style.id,
				name: style.name,
				effects: style.effects.map(effect => ({
					blendMode: effect.radius,
					radius: effect.radius,
					type: effect.type
				}))
			})),
			grid: styles.grid.map(style => ({
				id: style.id,
				name: style.name,
				layoutGrids: style.layoutGrids.map(grid => ({
					pattern: grid.pattern,
					sectionSize: grid.sectionSize,
					visible: grid.visible,
					color: grid.color
				}))
			}))
		}
	})
})

figma.ui.onmessage = async (props: {
	collections: TypeCollection[]
	collectionOptions: CollectionOptions
}) => {
	const content: { [key: string]: any } = {}
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

	const filterdCollections = props.collections.filter(c => c.isInclude)

	if (props.collectionOptions.type === "JSON") {
		collectionVariablesByMode.filter(c => filterdCollections.find((_c: any) => _c.key === c.key)).map((collection) => {
			const unitCollection = filterdCollections.find((c: any) => c.key === collection.key)

			content[collection.collectionName] = arrayToNestedObject(
				collection.variables,
				unitCollection ? unitCollection.unit : ""
			)
		})

		if (props.collectionOptions.separateFile) {
			const d = Object.entries(content).map(([key, value]) => {
				return {
					collectionName: key.replaceAll("/", "-"),
					data: JSON.stringify(value, null, 2)
				}
			})

			figma.ui.postMessage({
				type: "downloadJSONMultiple",
				data: d
			})
		} else {
			figma.ui.postMessage({
				type: "downloadJSON",
				data: content
			})
		}
  }

	if (props.collectionOptions.type === "TailwindCSSv4") {
		const tailwindCSSv4 = collectionVariablesByMode.filter(c => filterdCollections.find((_c: any) => _c.key === c.key)).map((collection) => {
			const unitCollection = filterdCollections.find((c: any) => c.key === collection.key)

			return {
				collectionName: collection.collectionName,
				data: convertToCSS(
					collection.variables,
					unitCollection ? unitCollection.nameSpace : "color",
					unitCollection ? unitCollection.unit : ""
			  )
			}
		})

		if (props.collectionOptions.separateFile) {
			const d = tailwindCSSv4.map(v => v.data)
			const c = d.join("\n")
			const data = tailwindCSSv4.map(v => {
				return {
					collectionName: v.collectionName.replaceAll("/", "-"),
					data: `@theme {\n${c}\n}`
				}
			})

			figma.ui.postMessage({
				type: "downloadTailwindCSSv4Multiple",
				data
			})
		} else {
			const _d = tailwindCSSv4.map(v => v.data)
			figma.ui.postMessage({
				type: "downloadTailwindCSSv4",
				data: `@theme {\n${_d.join("\n")}\n}`
			})
		}
	}
}
