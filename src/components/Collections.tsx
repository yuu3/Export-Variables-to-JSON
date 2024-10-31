import { Button } from "./Button"
import { Blend, Ellipsis, Palette, Type, Hash, ToggleLeft } from "lucide-react"
import type { Collection as TypeCollection } from "../types"
import {
	TYPE_COLOR,
	TYPE_NUMBER,
	TYPE_TEXT,
	TYPE_BOOLEAN
} from "../constants"

type Props = {
  collections: TypeCollection[]
  onClick: (collectionId: string) => void
}

const VariablesImage = (types: { name: string; count: number }[]) => {
  if (types.length !== 1) return <Blend size={16} />
  if (types[0].name === TYPE_COLOR) return <Palette size={16} />
  if (types[0].name === TYPE_TEXT) return <Type size={16} />
  if (types[0].name === TYPE_NUMBER) return <Hash size={16} />
  if (types[0].name === TYPE_BOOLEAN) return <ToggleLeft size={16} />
}

export const Collections = (props: Props) => {
  const _collections = [...props.collections]

  return (
    <ul className="grid gap-y-4">
      {_collections.sort((v, p) => v.name.toUpperCase() > p.name.toUpperCase() ? 1 : -1).map((collection) => (
        <li className="flex items-center justify-between">
          <div className={`flex items-center gap-x-4 ${collection.isInclude ? "text-gray-700" : "text-gray-400"}`}>
            <div className="p-2 border border-gray-300 rounded">{VariablesImage(collection.types)}</div>
            <div className="grid gap-y-1 text-xs">
              <p className="text-ellipsis overflow-hidden break-normal whitespace-nowrap">{collection.name}</p>
              <p>{collection.count} Variables</p>
            </div>
          </div>
          <Button
            name="edit"
            text=""
            variant="text"
            icon={<Ellipsis strokeWidth={1.2} size={16} className="text-black" />}
            onClick={() => props.onClick(collection.key)}
            onEnterkeyDown={() => props.onClick(collection.key)}
          />
        </li>
      ))}
    </ul>
  )
}
