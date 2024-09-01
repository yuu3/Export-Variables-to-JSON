import { useEffect, useState } from "react"
import "./App.css"

function App() {
	const [collections, setCollections] = useState<any[]>([])

	useEffect(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type === "getVariableCollections") {
				setCollections(event.data.pluginMessage.data as any[])
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
		parent.postMessage({ pluginMessage: { type: "exportVariables" } }, "*")
	}

	return (
		<main className="main">
			<ul className="collections">
				{collections.map((collection) => (
					<li key={collection.id}>{collection.name}</li>
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
