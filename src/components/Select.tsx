"use client"

import { ChevronDown } from "lucide-react"

type Props = {
	/**
	 * セレクトボックスのid
	 */
	id: string
	/**
	 * セレクトボックスの名前
	 */
	name: string
	/**
	 * セレクトボックスのアイテム
	 */
	options: {
		value: string | number
		text: string
	}[]
	/**
	 * 非推奨: セレクトボックスのプレースホルダ
	 */
	placeholder?: string
	/**
	 * セレクトボックスの値
	 */
	value?: string
	/**
	 * セレクトボックスの値が変更されたときのコールバック関数
	 */
	onChangeValue: (value: string) => void
	/**
	 * 無効化されているかどうか
	 * @default false
	 */
	disabled?: boolean
	/**
	 * 有効でない入力を保持しているかどうか
	 * @default false
	 */
	isInvalid?: boolean
	/**
	 * セレクトボックスのラベル
	 */
	ariaLabel?: string
}

export const Select = ({
	id,
	name,
	options,
	onChangeValue,
	value,
	disabled = false,
	isInvalid = false,
	ariaLabel
}: Props) => {
	const disabledStyle =
		"border-neutral-200 bg-neutral-100 text-neutral-300 cursor-not-allowed"
	const defaultStyle =
		"border-neutral-200 bg-white text-neutral-900"
	const errorStyle = "border-danger-500 text-danger-500"
	const style = () => {
		if (disabled) return disabledStyle
		if (isInvalid) return errorStyle

		return defaultStyle
	}
	const iconStyle = () => {
		if (disabled) return "text-neutral-300"
		if (isInvalid) return "text-danger-500"

		return "text-neutral-500"
	}

	return (
		<div className="relative">
			<select
				id={id}
				value={value}
				name={name}
				disabled={disabled}
				className={`${style()} inline-flex w-auto h-8 appearance-none items-center gap-x-4 rounded border pr-6 pl-2 text-xs focus:outline-2 focus:outline-blue-500 focus:outline-offset-4`}
				aria-label={ariaLabel ? ariaLabel : "Select"}
				onChange={(event) => onChangeValue(event.target.value)}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.text}
					</option>
				))}
			</select>
			<ChevronDown
				size={14}
				className={`${iconStyle()} pointer-events-none absolute top-2.5 right-2`}
			/>
		</div>
	)
}
