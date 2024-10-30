type Props = {
	name: string
	checked: boolean
	onChange: (value: boolean) => void
}

export const Toggle = (props: Props) => {
	return (
		<label
			className={`relative w-8 h-4 px-0.5 flex cursor-pointer items-center gap-x-2 rounded-full focus:outline-2 focus:outline-blue-500 focus:outline-offset-4 ${props.checked ? "bg-teal-500" : "bg-gray-200"}`}
		>
			<input
				name={props.name}
				defaultChecked={props.checked}
				type="checkbox"
				onChange={(event) => props.onChange(event.target.checked)}
				className="-z-10 absolute inset-0"
				aria-label="checkbox"
			/>
			<div
				className={`absolute inset-y-auto size-3 rounded-full bg-white transition-transform duration-200 ${props.checked ? "translate-x-4" : "translate-x-0"}`}
			/>
		</label>
	)
}
