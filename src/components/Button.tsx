"use client"

import React from "react"

type ButtonVariant = "primary" | "secondary" | "text"
type Props = {
	name: string
	/**
	 * ボタンに表示するテキスト
	 */
	text: string
	/**
	 * ボタンのスタイルを指定する
	 */
	variant?: ButtonVariant
	/**
	 * ボタンに表示するアイコン
	 */
	icon?: React.ReactNode
	/**
	 * ボタンを無効化するかどうか
	 */
	disabled?: boolean
	/**
	 * ネイティブのbutton要素のtype属性
	 */
	type?: HTMLButtonElement["type"]
	/**
	 * ボタンのサイズ
	 */
	size?: "xs" | "sm" | "md"
	/**
	 * ボタンがクリックされたときのコールバック関数
	 */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	/**
	 * ボタンがEnterキーで押されたときのコールバック関数
	 */
	onEnterkeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
	(
		{
			name,
			text,
			variant = "secondary",
			size = "xs",
			icon,
			disabled = false,
			type = "button",
			onClick,
			onEnterkeyDown,
			...props
		},
		ref
	) => {
		const disabledStyle =
			"border-transparent bg-gray-100 text-gray-500 cursor-not-allowed"
		const tealStyle = "border-transparent bg-teal-500 text-white"
		const secondaryStyle = "border-teal-500 text-teal-700"
		const textStyle =
			"border-transparent bg-white text-gray-900 hover:bg-gray-100"
		const style = () => {
			if (disabled) return disabledStyle
			if (variant === "primary") return tealStyle
			if (variant === "secondary") return secondaryStyle

			return textStyle
		}

		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(event)
		}
		const enterkeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === "Enter") {
				onEnterkeyDown?.(event)
			}
		}

		return (
			<button
				type={type}
				name={name}
				disabled={disabled}
				aria-label={text ? text : "button"}
				aria-hidden={disabled}
				onClick={handleClick}
				onKeyDown={enterkeyDown}
				ref={ref}
				className={`${style()} text-xs leading-none flex items-center justify-center gap-x-1 rounded p-3 border focus:outline-2 focus:outline-blue-500 focus:outline-offset-4`}
				{...props}
			>
				{icon && <span>{icon}</span>}
				{text}
			</button>
		)
	}
)
