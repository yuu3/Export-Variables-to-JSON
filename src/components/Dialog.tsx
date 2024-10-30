import * as DialogPrimitive from "@radix-ui/react-dialog"
import React from "react"

const Root = DialogPrimitive.Root
const Portal = DialogPrimitive.Portal

const Trigger = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ children, ...props }, ref) => (
	<DialogPrimitive.Trigger ref={ref} {...props}>
		<div>{children}</div>
	</DialogPrimitive.Trigger>
))

const Content = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, ref) => {
	return (
		<DialogPrimitive.Content
			ref={ref}
			className="p-1 bg-white border border-gray-200 rounded-base shadow-lg text-neutral-700"
			{...props}
		>
      <>
        <DialogPrimitive.DialogOverlay className="fixed inset-0 bg-black bg-opacity-10" />
        <div className="absolute right-0 bottom-0 z-20 w-full">{children}</div>
      </>
		</DialogPrimitive.Content>
	)
})

export { Root, Trigger, Portal, Content }
