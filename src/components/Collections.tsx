import { Button } from "./Button"
import { Toggle } from "./Toggle"
import { Select } from "./Select"
import { Checkbox } from "./Checkbox"
import { TYPE_NUMBER } from "../constants"
import type {
  Collection as TypeCollection,
  CollectionOptions
} from "../types"

type Props = {
  collections: TypeCollection[]
  collectionOptions: CollectionOptions
  onChangeCollection: (collection: TypeCollection) => void
  onChangeCollectionOptionType: (type: string) => void
  onChangeCollectionOptionSeparateFile: (separateFile: boolean) => void
  onDownload: () => void
}

const units = [
  { value: "", text: "-" },
  { value: "px", text: "px" },
  { value: "rem", text: "rem" },
  { value: "em", text: "em" },
  { value: "%", text: "%" }
]
const nameSpaces = [
  { value: "color", text: "Color" },
  { value: "spacing", text: "Spacing" },
  { value: "radius", text: "Radius" }
]
const options = [
  { value: "JSON", text: "JSON" },
  { value: "TailwindCSSv4", text: "TailwindCSS v4 theme" }
]

export const Collections = (props: Props) => {
  const _collections = [...props.collections]
  const onChangeUnit = (value: string, collectionId: string) => {
		const collection = props.collections.find(c => c.key === collectionId)

		if (collection) {
			collection.unit = value
      props.onChangeCollection(collection)
		}
	}
	const onChangeIsInclude = (value: boolean, collectionId: string) => {
		const collection = props.collections.find(c => c.key === collectionId)

		if (collection) {
			collection.isInclude = value
      props.onChangeCollection(collection)
		}
	}
  const onChangeNameSpace = (value: string, collectionId: string) => {
    const collection = props.collections.find(c => c.key === collectionId)

    if (collection) {
      collection.nameSpace = value as any
      props.onChangeCollection(collection)
    }
  }

  return (
    <div className="grid gap-y-4">
      <div className="grid gap-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Local Variables</h2>
        <div className="border border-gray-200 rounded px-4 py-1">
          <div className="flex gap-x-2 py-1 border-b border-gray-200 text-xs">
            <p className="w-36 text-gray-700">Name</p>
            <p className="w-20 text-gray-700">Total</p>
            <p className="w-14 text-gray-700">Unit</p>
            <p className="w-20 text-gray-700">NameSpace</p>
          </div>
          <ul>
            {_collections.sort((v, p) => v.name.toUpperCase() > p.name.toUpperCase() ? 1 : -1).map((collection) => (
              <li className="flex items-center gap-x-2 py-2 border-b border-gray-200 last:border-b-0">
                <p className={`${collection.isInclude ? 'text-gray-700' : 'text-gray-400'} w-36 text-xs text-ellipsis overflow-hidden break-normal whitespace-nowrap`}>{collection.name}</p>
                <p className={`${collection.isInclude ? 'text-gray-700' : 'text-gray-400'} w-20 text-xs text-ellipsis overflow-hidden break-normal whitespace-nowrap`}>{collection.count} Variables</p>
                <Select
                  id={`${collection.key}-unit`}
                  name={`${collection.key}-unit`}
                  value={collection.unit}
                  options={units}
                  disabled={!collection.isInclude || !collection.types.some(type => type.name === TYPE_NUMBER)}
                  onChangeValue={(value) => onChangeUnit(value, collection.key)}
                />
                <Select
                  id={`${collection.key}-nameSpace`}
                  name={`${collection.key}-nameSpace`}
                  value={collection.nameSpace}
                  options={nameSpaces}
                  disabled={!collection.isInclude || props.collectionOptions.type !== "TailwindCSSv4"}
                  onChangeValue={(value) => onChangeNameSpace(value, collection.key)}
                />
                <div className="ml-auto">
                  <Toggle
                    name={`${collection.key}-include`}
                    checked={collection.isInclude}
                    onChange={value => onChangeIsInclude(value, collection.key)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid gap-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Options</h2>
        <div className="grid border border-gray-200 rounded px-4 py-1">
          <div className="flex items-center justify-between gap-x-2 py-2 border-b border-gray-200">
            <p className="text-gray-700 text-xs">Export Type</p>
            <Select
              id="type"
              name="type"
              value={props.collectionOptions.type}
              options={options}
              onChangeValue={(value) => props.onChangeCollectionOptionType(value)}
            />
          </div>
          <div className="h-12 flex items-center justify-between gap-x-2 py-2">
            <p className="text-gray-700 text-xs">Separate files by collection</p>
            <Checkbox
              name="separate"
              text=""
              checked={props.collectionOptions.separateFile}
              onChange={(value) => props.onChangeCollectionOptionSeparateFile(value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          name="download"
          text="Export"
          variant="primary"
          size="sm"
          onClick={() => props.onDownload()}
          onEnterkeyDown={() => props.onDownload()}
        />
      </div>
      <a
				download={true}
				href="tokens.json"
				id="downLoadLink"
				className="hidden"
			>
				download
			</a>
    </div>
  )
}
