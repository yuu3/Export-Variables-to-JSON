import { Toggle } from "./Toggle"
import type { Styles } from "../figma"

type Props = {
  localStyles: Styles
  onClick: (styleKey: string) => void
}

export const LocalStyles = (props: Props) => {
  return (
    <div className="grid gap-y-2">
      <h2 className="text-sm font-semibold text-gray-700">Local Styles</h2>
      <div className="grid border border-gray-200 rounded px-4 py-1">
        {props.localStyles.text.length !== 0 && (
          <div className="flex gap-x-2 py-2 border-b border-gray-200 text-xs text-gray-700 last:border-b-0">
            <p className="w-28 text-gray-700 text-xs text-ellipsis overflow-hidden break-normal whitespace-nowrap">Text Styles</p>
            <p className="w-20 text-gray-700 text-xs text-ellipsis overflow-hidden break-normal whitespace-nowrap">{props.localStyles.text.length} Styles</p>
          </div>
        )}
        {props.localStyles.fill.length !== 0 && (
          <div className="grid gap-y-1 py-2 border-b border-gray-200 text-xs text-gray-700 last:border-b-0">
            <p className="">Fill Styles</p>
            <p>{props.localStyles.fill.length} Styles</p>
          </div>
        )}
        {props.localStyles.grid.length !== 0 && (
          <div className="grid gap-y-1 py-2 border-b border-gray-200 text-xs text-gray-700 last:border-b-0">
            <p className="">Grid Styles</p>
            <p>{props.localStyles.grid.length} Styles</p>
          </div>
        )}
        {props.localStyles.effect.length !== 0 && (
          <div className="grid gap-y-1 py-2 text-xs text-gray-700">
            <p className="">Effect Styles</p>
            <p>{props.localStyles.effect.length} Styles</p>
          </div>
        )}
      </div>
    </div>
  )
}
