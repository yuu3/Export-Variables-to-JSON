import { useEffect, useState } from "react"
import { Collection } from "./components/Collection"
import { Button } from "./components/Button"
import "./output.css"

function App() {
	const [collections, setCollections] = useState<any[]>([])

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
	const onChangeUnit = (value: string, collectionId: string) => {
		const _collection = collections.find(c => c.key === collectionId)
		const otherCollections = collections.filter(c => c.key !== collectionId)

		if (_collection) {
			setCollections([
				...otherCollections,
				{
					..._collection,
					unit: value
				}
			])
		}
	}
	const onChangeIsInclude = (value: boolean, collectionId: string) => {
		const _collection = collections.find(c => c.key === collectionId)
		const otherCollections = collections.filter(c => c.key !== collectionId)

		if (_collection) {
			setCollections([
				...otherCollections,
				{
					..._collection,
					isInclude: value
				}
			])
		}
	}

	return (
		<main className="grid gap-y-4 p-4">
			<ul className="grid gap-y-4">
				{collections.sort((v, p) => v.name.toUpperCase() > p.name.toUpperCase() ? 1 : -1).map((collection) => (
					<Collection
						collection={collection}
						onChangeUnit={onChangeUnit}
						onChangeIsInclude={onChangeIsInclude}
					/>
				))}
			</ul>
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
