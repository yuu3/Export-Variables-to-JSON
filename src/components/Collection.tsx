import { useState } from "react"
import { Select } from "./Select"
import { Toggle } from "./Toggle"
import * as Dialog from "./Dialog"
import { Button } from "./Button"
import { Blend, Ellipsis, Palette, Type, Hash, ToggleLeft, X } from "lucide-react"
import type { Collection as TypeCollection } from "../types"
import {
	TYPE_COLOR,
	TYPE_NUMBER,
	TYPE_TEXT,
	TYPE_BOOLEAN
} from "../constants"

type Props = {
  collection: TypeCollection
  onChangeUnit: (value: string, collectionId: string) => void
  onChangeIsInclude: (value: boolean, collectionId: string) => void
}

const VariablesImage = (types: { name: string; count: number }[]) => {
  const icon = () => {
    if (types.length !== 1) return <Blend size={16} />

    if (types[0].name === TYPE_COLOR) return <Palette size={16} />
    if (types[0].name === TYPE_TEXT) return <Type size={16} />
    if (types[0].name === TYPE_NUMBER) return <Hash size={16} />
    if (types[0].name === TYPE_BOOLEAN) return <ToggleLeft size={16} />
  }

  return icon()
}

const VariableImage = (types: { name: string; count: number }[]) => {
  const icon = () => {
    if (types[0].name === TYPE_COLOR) return <Palette size={16} />
    if (types[0].name === TYPE_TEXT) return <Type size={16} />
    if (types[0].name === TYPE_NUMBER) return <Hash size={16} />
    if (types[0].name === TYPE_BOOLEAN) return <ToggleLeft size={16} />
  }

  return icon()
}

const options = [
  { value: "", text: "" },
  { value: "px", text: "px" },
  { value: "rem", text: "rem" },
  { value: "em", text: "em" },
  { value: "%", text: "%" }
]

export const Collection = (props: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <div className="p-2 border border-gray-300 rounded text-gray-700">{VariablesImage(props.collection.types)}</div>
        <div className="grid gap-y-1 text-xs">
          <p>{props.collection.name}</p>
          <p className="text-gray-700">{props.collection.count} Variables</p>
        </div>
      </div>
      <Dialog.Root open={open}>
        <Dialog.Trigger asChild>
          <Button
            name="dropdown"
            text=""
            variant="text"
            icon={<Ellipsis strokeWidth={1.2} size={16} className="text-black" />}
            onClick={() => setOpen(!open)}
            onEnterkeyDown={() => setOpen(!open)}
          />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content
            asChild
            aria-hidden={!open}
          >
            <div className="h-screen grid gap-y-4 content-start bg-white p-4 overflow-y-scroll pb-[70px]">
              <div className="flex justify-between items-center">
                <h1 className="text-base text-gray-900">{props.collection.name}</h1>
                <button
                  type="button"
                  className="rounded p-1 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <X strokeWidth={1.2} size={16} />
                </button>
              </div>
              <div className="grid gap-y-4">
                <ul className="grid gap-y-2">
                  {props.collection.types.map(type => (
                    <li key={type.name} className="flex items-center gap-x-4">
                      <div className="p-2 border border-gray-300 rounded text-gray-700">{VariableImage(props.collection.types)}</div>
                      <div className="grid gap-y-1 text-xs">
                        <p>Type: {type.name}</p>
                        <p className="text-gray-700">{type.count} Variables</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-300" />
                <p className="text-sm text-gray-900">Options</p>
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
                    options={options}
                    onChangeValue={value => props.onChangeUnit(value, props.collection.key)}
                  />
                </div>
              </div>
              <div className="fixed left-0 bottom-0 p-4 grid w-full bg-white">
                <Button
                  name="update"
                  text="Update"
                  variant="secondary"
                  onClick={() => setOpen(!open)}
                  onEnterkeyDown={() => setOpen(!open)}
                />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </li>
  )
}
