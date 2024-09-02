import type { CollectionVariableValue, Mode } from "./types"

// RGBをHEXに変換
const _rgbaToHex = (args: RGB) => {
	const toHex = (c: number) => {
		const hex = Math.round(c * 255)
			.toString(16)
			.padStart(2, "0")

		return hex.length === 1 ? `0 + ${hex}` : hex
	}

	const red = toHex(args.r)
	const green = toHex(args.g)
	const blue = toHex(args.b)

	return `#${red}${green}${blue}`
}

export const arrayToNestedObject = (args: CollectionVariableValue) => {
	const result: any = {}

	args.map((variable) => {
		const keys = variable.name.split("/")
		let current = result

		keys.map((key) => {
			if (!current[key]) current[key] = {}

			current = current[key]
		})

		variable.values.map((v) => {
			const isColor = typeof v.value === "object" && variable.type === "COLOR"

			if (variable.modes.length === 1) {
				const propertyKeys = keys.map((key) => key)
				const lastKey = propertyKeys.pop()
				const keyCount = keys.length
				let _current = result

				keys.map((key, index) => {
					if (keyCount === 1)
						result[key] = isColor ? _rgbaToHex(v.value) : v.value

					if (index === keyCount - 1 && lastKey) {
						_current[lastKey] = isColor ? _rgbaToHex(v.value) : v.value
					} else {
						_current = _current[key]
					}
				})
			} else {
				current[v.modeName] = isColor ? _rgbaToHex(v.value) : v.value
			}
		})
	})

	return result
}
