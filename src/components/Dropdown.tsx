import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import React from "react"

const Root = DropdownMenuPrimitive.Root
const Portal = DropdownMenuPrimitive.Portal

const Trigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ children, ...props }, ref) => (
	<DropdownMenuPrimitive.Trigger ref={ref} {...props}>
		<div>{children}</div>
	</DropdownMenuPrimitive.Trigger>
))

const Content = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ children, sideOffset = 4, ...props }, ref) => {
	return (
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className="p-1 bg-white border border-gray-200 rounded-base shadow-lg text-neutral-700"
			{...props}
		>
			<div>{children}</div>
		</DropdownMenuPrimitive.Content>
	)
})

const Item = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ children, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className="p-3 text-neutral-700 text-label-sm cursor-pointer hover:bg-neutral-100 focus:outline-2 focus:outline-info-500 focus:outline-offset-4"
		{...props}
	>
		{children}
	</DropdownMenuPrimitive.Item>
))

export { Root, Trigger, Portal, Content, Item }
