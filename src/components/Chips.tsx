type Props = {
	id: string
	name: string
	/**
	 * 表示するテキスト
	 */
	text: string
	/**
	 * 有効な状態になっているか
	 * @default false
	 */
	isActive?: boolean
	/**
	 * テキストの左側に表示するアイコン
	 */
	icon?: React.ReactNode
	/**
	 * 無効化されているかどうか
	 * @default false
	 */
	disabled?: boolean
	/**
	 * クリックされたときのコールバック関数
	 */
	onClick: () => void
}

export const Chip = ({
	id,
	name,
	icon,
	text,
	isActive = false,
	disabled = false,
	onClick
}: Props) => {
	const activeStyle =
		"border-primary-500 text-primary-700 bg-primary-100 cursor-pointer"
	const disabledStyle =
		"border-neutral-300 text-neutral-500 bg-neutral-100 cursor-not-allowed"
	const style = () => {
		if (isActive) return activeStyle
		if (disabled) return disabledStyle

		return "border-neutral-300 text-neutral-900 cursor-pointer"
	}

	return (
		<div className="relative">
			<input
				type="checkbox"
				id={id}
				name={name}
				disabled={disabled}
				onChange={() => onClick()}
				className="absolute inset-0 opacity-0"
				aria-label="chip icon"
			/>
			<button
				type="button"
				disabled={disabled}
				className="rounded-base focus:outline-2 focus:outline-blue-500 focus:outline-offset-4"
			>
				<label
					htmlFor={id}
					className={`${style()} relative inline-flex w-auto items-center gap-x-2 rounded-base border p-2`}
				>
					{icon && icon}
					<p className="text-label-xs">{text}</p>
				</label>
			</button>
		</div>
	)
}
