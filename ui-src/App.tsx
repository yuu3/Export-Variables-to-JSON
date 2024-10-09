import { useEffect, useState } from "react"
import "./App.css"

function App() {
	const [collections, setCollections] = useState<any[]>([])

	useEffect(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type === "getVariableCollections") {
				const _collections = event.data.pluginMessage.data as any[]

				setCollections(_collections.map(v => ({
					...v,
					unit: ""
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

				downLoadLink.download = "export_variables.json"
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
		parent.postMessage({ pluginMessage: { type: "exportVariables", collections } }, "*")
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

	return (
		<main className="main">
			<ul className="collections">
				{collections.map((collection) => (
					<li key={collection.key}>
						{collection.name}
						<select name={`${collection.key}-unit`} onChange={event => onChangeUnit(event.target.value, collection.key)}>
							<option value=""></option>
							<option value="px">px</option>
							<option value="per">percent</option>
							<option value="rem">rem</option>
							<option value="em">em</option>
						</select>
					</li>
				))}
			</ul>
			<div>
				<button type="button" onClick={onDownload}>
					Export to JSON
				</button>
			</div>
			<a
				download={true}
				href="export.json"
				id="downLoadLink"
				style={{ display: "none" }}
			>
				download
			</a>
		</main>
	)
}

export default App
