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

export const arrayToNestedObject = (args: CollectionVariableValue, unit: string) => {
	const result: any = {}

	args.map((variable) => {
		const keys = variable.name.split("/")
		let current = result

		keys.map((key) => {
			if (!current[key]) current[key] = {}

			current = current[key]
		})

		const isColor = typeof variable.value === "object" && variable.type === "COLOR"
		const _value = () => {
			if (typeof variable.value === "string") return variable.value

			return `${variable.value}${unit}`
		}

		const propertyKeys = keys.map((key) => key)
		const lastKey = propertyKeys.pop()
		const keyCount = keys.length
		let _current = result

		keys.map((key, index) => {
			if (keyCount === 1)
				result[key] = isColor ? _rgbaToHex(variable.value as RGBA) : _value()

			if (index === keyCount - 1 && lastKey) {
				_current[lastKey] = isColor ? _rgbaToHex(variable.value as RGBA) :  _value()
			} else {
				_current = _current[key]
			}
		})
	})

	return result
}

export const download = (data: any, fileName: string, type: string, isJSON: boolean = false) => {
  const blob = isJSON ? new Blob(
    [JSON.stringify(data, null, "  ")],
    { type }
  ) : new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const downLoadLink = document.getElementById(
    "downLoadLink"
  ) as HTMLAnchorElement

  downLoadLink.download = fileName
  downLoadLink.href = url
  downLoadLink.dataset.downloadurl = [
    downLoadLink.download,
    downLoadLink.href
  ].join(":")
  downLoadLink.click()

  URL.revokeObjectURL(url)
}

type ThemeObject = {
  [key: string]: string | ThemeObject;
}

export const convertToCSS = (args: CollectionVariableValue, nameSpace: string, unit: string): string => {
  const lines: string[] = []

  const result: any = {}

	args.map((variable) => {
		const keys = variable.name.split("/")
		let current = result

		keys.map((key) => {
			if (!current[key]) current[key] = {}

			current = current[key]
		})

		const isColor = typeof variable.value === "object" && variable.type === "COLOR"
		const _value = () => {
			if (typeof variable.value === "string") return variable.value

			return variable.value
		}

		const propertyKeys = keys.map((key) => key)
		const lastKey = propertyKeys.pop()
		const keyCount = keys.length
		let _current = result

		keys.map((key, index) => {
			if (keyCount === 1)
				result[key] = isColor ? _rgbaToHex(variable.value as RGBA) : _value()

			if (index === keyCount - 1 && lastKey) {
				_current[lastKey] = isColor ? _rgbaToHex(variable.value as RGBA) :  _value()
			} else {
				_current = _current[key]
			}
		})
	})

  lines.push(`  --${nameSpace}-*: initial;`)

  function processObject(obj: ThemeObject, prefix: string = "") {
    for (const key in obj) {
      const value = obj[key]
      const cssKey = prefix ? `${prefix}-${key}` : key

      if (typeof value === "string") {
        lines.push(`  --${nameSpace}-${cssKey}: ${value};`)
      } else if (typeof value === "object") {
        processObject(value, prefix ? `${prefix}-${key}` : key)
      } else {
        lines.push(`  --${nameSpace}-${cssKey}: ${value}${unit};`)
      }
    }
  }

  processObject(result)

  return lines.join("\n")
}