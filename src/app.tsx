import { useEffect, useState } from "react"
import JSZip from "jszip"
import { Collections } from "./components/Collections"
import { download } from "./libs"
import "./output.css"
import type {
	Collection as TypeCollection,
	CollectionOptions
} from "./types"

function App() {
	const [collections, setCollections] = useState<TypeCollection[]>([])
	const [collectionOptions, setCollectionOptions] = useState<CollectionOptions>({
		type: "JSON",
		separateFile: false
	})
	const zip = new JSZip()

	useEffect(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type === "getVariableCollections") setCollections(event.data.pluginMessage.data)
			if (event.data.pluginMessage.type === "downloadJSON") {
				download(event.data.pluginMessage.data, "tokens.json", "application/json", true)
			}
			if (event.data.pluginMessage.type === "downloadJSONMultiple") {
				for (const data of event.data.pluginMessage.data) {
					zip.file(`${data.collectionName}.json`, data.data)
				}

				zip.generateAsync({ type: "blob" }).then(function(content) {
					download(content, "tokens.zip", "application/zip")
				})
				zip.remove("tokens.json")

				for (const data of event.data.pluginMessage.data) {
					zip.remove(`${data.collectionName}.json`)
				}
			}
			if (event.data.pluginMessage.type === "downloadTailwindCSSv4Multiple") {
				for (const data of event.data.pluginMessage.data) {
					zip.file(`${data.collectionName}.css`, data.data)
				}

				zip.generateAsync({ type: "blob" }).then(function(content) {
					download(content, "tokens.zip", "application/zip")
				})
				zip.remove("tokens.json")

				for (const data of event.data.pluginMessage.data) {
					zip.remove(`${data.collectionName}.css`)
				}
			}
			if (event.data.pluginMessage.type === "downloadTailwindCSSv4") {
				download(event.data.pluginMessage.data, "tailwind.css", "text/css")
			}
		}
	}, [])

	const onDownload = () => {
		parent.postMessage({ pluginMessage: {
			type: "exportVariables",
			collections,
			collectionOptions
		}}, "*")
	}
	const onChangeCollection = (collection: TypeCollection) => setCollections(collections.map(c => c.key === collection.key ? collection : c))
	const onChangeCollectionOptionType = (type: string) => setCollectionOptions({
		...collectionOptions,
		type
	})
	const onChangeCollectionOptionSeparateFile = (separateFile: boolean) => setCollectionOptions({
		...collectionOptions,
		separateFile
	})

	return (
		<main className="grid gap-y-4 p-4">
			<Collections
				collections={collections}
				onChangeCollection={onChangeCollection}
				collectionOptions={collectionOptions}
				onChangeCollectionOptionType={onChangeCollectionOptionType}
				onChangeCollectionOptionSeparateFile={onChangeCollectionOptionSeparateFile}
				onDownload={onDownload}
			/>
		</main>
	)
}

export default App
