import { Select } from "./Select"
import { Toggle } from "./Toggle"
import * as Dialog from "./Dialog"
import { Button } from "./Button"
import { Palette, Type, Hash, ToggleLeft, X } from "lucide-react"
import type { Collection as TypeCollection } from "../types"
import {
	TYPE_COLOR,
	TYPE_NUMBER,
	TYPE_TEXT,
	TYPE_BOOLEAN
} from "../constants"

type Props = {
  collection: TypeCollection
  open: boolean
  close: () => void
  save: () => void
  onChangeUnit: (value: string, collectionId: string) => void
  onChangeIsInclude: (value: boolean, collectionId: string) => void
}

const VariableImage = (types: { name: string; count: number }) => {
  if (types.name === TYPE_COLOR) return <Palette size={16} />
  if (types.name === TYPE_TEXT) return <Type size={16} />
  if (types.name === TYPE_NUMBER) return <Hash size={16} />
  if (types.name === TYPE_BOOLEAN) return <ToggleLeft size={16} />
}

const options = [
  { value: "", text: "" },
  { value: "px", text: "px" },
  { value: "rem", text: "rem" },
  { value: "em", text: "em" },
  { value: "%", text: "%" }
]

export const Collection = (props: Props) => {
  return (
    <Dialog.Root open={props.open}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Content
          asChild
          aria-hidden={!open}
        >
          <div className="h-screen grid gap-y-4 content-start bg-white p-4 overflow-y-scroll pb-[70px]">
            <div className="flex justify-between items-start">
              <Dialog.Title asChild>
                <h1 className="flex-grow text-base text-gray-900 text-ellipsis overflow-hidden break-normal whitespace-pre-wrap">{props.collection.name}</h1>
              </Dialog.Title>
              <Button
                name="close"
                text=""
                variant="text"
                icon={<X strokeWidth={1.2} size={16} />}
                onClick={() => props.close()}
                onEnterkeyDown={() => props.close()}
              />
            </div>
            <ul className="grid gap-y-2">
              {props.collection.types.map(type => (
                <li key={type.name} className="flex items-center gap-x-4">
                  <div className="p-2 border border-gray-300 rounded text-gray-700">{VariableImage(type)}</div>
                  <div className="grid gap-y-1 text-xs">
                    <p>Type: {type.name}</p>
                    <p className="text-gray-700">{type.count} Variables</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="grid gap-y-4 text-gray-900">
              <p className="text-sm">Options</p>
              <div className="grid gap-y-2">
                <div className="flex items-center justify-between gap-x-2">
                  <p className="text-xs">Include</p>
                  <Toggle
                    name={`${props.collection.key}-include`}
                    checked={props.collection.isInclude}
                    onChange={value => props.onChangeIsInclude(value, props.collection.key)}
                  />
                </div>
                <div className="flex items-center justify-between gap-x-2">
                  <p className="text-xs">Unit</p>
                  <Select
                    id="unit"
                    name={`${props.collection.key}-unit`}
                    value={props.collection.unit}
                    options={options}
                    onChangeValue={value => props.onChangeUnit(value, props.collection.key)}
                  />
                </div>
              </div>
            </div>
            <div className="fixed left-0 bottom-0 p-4 grid w-full bg-white">
              <Button
                name="change"
                text="Change"
                variant="secondary"
                size="sm"
                onClick={() => props.save()}
                onEnterkeyDown={() => props.save()}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
