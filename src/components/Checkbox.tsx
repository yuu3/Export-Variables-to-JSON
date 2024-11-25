import { Check } from "lucide-react"

type Props = {
	name: string
	text: string
	checked: boolean
	onChange: (value: boolean) => void
}

export const Checkbox = (props: Props) => {
	return (
		<label className="relative flex cursor-pointer items-center gap-x-2 bg-white focus:outline-2 focus:outline-blue-500 focus:outline-offset-4">
			<input
				type="checkbox"
				name={props.name}
				defaultChecked={props.checked}
				onChange={(event) => props.onChange(event.target.checked)}
				className="-z-10 absolute inset-0"
				aria-label="checkbox"
			/>
			<div className={`grid place-items-center rounded border-2 border-teal-500 ${props.checked ? "bg-teal-500" : ""} size-5`}>
				<Check size={14} strokeWidth={4} className="text-white" />
			</div>
			<p className="text-label-xs">{props.text}</p>
		</label>
	)
}
