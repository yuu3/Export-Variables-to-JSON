import { useEffect, useState } from "react"
import { Collections } from "./components/Collections"
import { Collection } from "./components/Collection"
import { Button } from "./components/Button"
import "./output.css"

function App() {
	const [collections, setCollections] = useState<any[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [selectedCollection, setSelectedCollection] = useState<any>(null)

	useEffect(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type === "getVariableCollections") {
				const _collections = event.data.pluginMessage.data as any[]

				setCollections(_collections.map((collection) => ({
					...collection,
					unit: "",
					isInclude: true
				})))
			}

			if (event.data.pluginMessage.type === "downloadJSON") {
				const blob = new Blob(
					[JSON.stringify(event.data.pluginMessage.data, null, "  ")],
					{ type: "application/json" }
				)
				const url = URL.createObjectURL(blob)
				const downLoadLink = document.getElementById(
					"downLoadLink"
				) as HTMLAnchorElement

				downLoadLink.download = "tokens.json"
				downLoadLink.href = url
				downLoadLink.dataset.downloadurl = [
					"text/plain",
					downLoadLink.download,
					downLoadLink.href
				].join(":")
				downLoadLink.click()
			}
		}
	}, [])

	const onDownload = () => {
		const _collections = collections.filter(c => c.isInclude)

		parent.postMessage({ pluginMessage: { type: "exportVariables", _collections } }, "*")
	}
	const onChangeUnit = (value: string) => {
		setSelectedCollection({
			...selectedCollection,
			unit: value
		})
	}
	const onChangeIsInclude = (value: boolean) => {
		setSelectedCollection({
			...selectedCollection,
			isInclude: value
		})
	}
	const changeCollection = (collectionId: string) => {
		const collection = collections.find(c => c.key === collectionId)

		if (collection) {
			setSelectedCollection(collection)
			setIsOpen(true)
		}
	}

	const close = () => {
		setIsOpen(false)
		setSelectedCollection(null)
	}
	const save = () => {
		const otherCollections = collections.filter(c => c.key !== selectedCollection.key)

		setCollections([
			...otherCollections,
			selectedCollection
		])
		setIsOpen(false)
	}

	return (
		<main className="grid gap-y-4 p-4">
			<h1 className="text-base text-gray-900">Collections</h1>
			<Collections
			  collections={collections}
				onClick={changeCollection}
			/>
			{selectedCollection && (
				<Collection
					collection={selectedCollection}
					open={isOpen}
					close={close}
					save={save}
					onChangeUnit={onChangeUnit}
					onChangeIsInclude={onChangeIsInclude}
				/>
			)}
			{collections.length === 0 && (
				<p className="text-sm">
					nothing collections
				</p>
			)}
			<div className="fixed left-0 bottom-0 w-full grid p-4 bg-white">
				<Button
					name="download"
					text="Export to JSON"
					variant="primary"
					size="sm"
					onClick={() => onDownload()}
					onEnterkeyDown={() => onDownload()}
				/>
			</div>
			<a
				download={true}
				href="tokens.json"
				id="downLoadLink"
				className="hidden"
			>
				download
			</a>
		</main>
	)
}

export default App
