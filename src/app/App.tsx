/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react"
import { flatten, set } from "lodash"
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { getNode } from "../api/mock"
import { NodeBranch, NodeChildren } from "./types"
import { DRFC } from "../general/types"
import { useMountEffect } from "../general/utils/lifeCycles"
import { reliablyGetValues } from "../general/utils/object"
import { requestChildren } from "./requests"
import NodeComponent from "./NodeComponent"

function App() {
	const [tree, setTree] = useImmer<NodeChildren>({})
	const [openBranch, setOpenBranch] = useState<string[]>([])

	useEffect(() => {
		const request = async () => {
			const children = (await requestChildren(openBranch)) as NodeChildren
			const childrenKeys = flatten(openBranch.map((branchName) => [branchName, "children"]))

			setTree((draftTree) => {
				console.log(draftTree)
				if (childrenKeys.length === 0) {
					return children
				}
				set(draftTree!, childrenKeys, children)
			})
		}

		request()
	}, [openBranch])

	return (
		<div
			css={{
				margin: 20,
			}}
		>
			{tree &&
				reliablyGetValues(tree).map((nodeBranch) => (
					<NodeComponent
						node={nodeBranch}
						openNode={(keys: string[]) => {
							console.log(keys)
							setOpenBranch(keys)
						}}
						key={nodeBranch.name}
					/>
				))}
		</div>
	)
}

export default App
