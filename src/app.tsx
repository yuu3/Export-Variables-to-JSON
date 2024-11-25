import { useEffect, useState } from "react"
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

	useEffect(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type === "getVariableCollections") setCollections(event.data.pluginMessage.data)
			if (event.data.pluginMessage.type === "downloadJSON") {
				download(event.data.pluginMessage.data, "tokens.json")
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
