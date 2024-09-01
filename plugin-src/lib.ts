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
			if (typeof v.value === "object" && variable.type === "COLOR") {
				if (variable.modes.length === 1) {
					keys.map((key) => {
						if (result[key]) {
							current[key] = _rgbaToHex(v.value)
						} else {
						}
					})
				} else {
					current[v.modeName] = _rgbaToHex(v.value)
				}
			} else {
				if (variable.modes.length === 1) {
					keys.map((key) => {
						if (result[key]) {
							current[key] = v.value
						}
					})
				} else {
					current[v.modeName] = v.value
				}
			}
		})
	})

	return result
}
