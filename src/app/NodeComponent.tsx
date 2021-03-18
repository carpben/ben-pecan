/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react"
import { faChevronDown, faChevronRight, faEyeSlash, faFont } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback, useState } from "react"
import { Button } from "../general/components/Button"
import { styleCenterSingleChild } from "../general/styles"
import { DRFC } from "../general/types"
import { reliablyGetValues } from "../general/utils/object"
import { NodeBranch } from "./types"

interface Props {
	node: NodeBranch
	openNode: (keys: string[]) => unknown
}

const NodeComponent: DRFC<Props> = React.memo((props) => {
	const { node, openNode } = props
	const { children, canAccess, type } = node

	const [open, setOpen] = useState(false)

	const openChildNode = useCallback(
		(keys: string[]) => {
			console.log("29")
			openNode([node.name, ...keys])
		},
		[node],
	)

	const clickable = canAccess && type !== "column"

	return (
		<div>
			<Button
				handler={
					clickable
						? () => {
								if (open && canAccess) {
									setOpen(false)
								} else {
									openNode([node.name])
									setOpen(true)
								}
						  }
						: () => {}
				}
				css={{
					display: "flex",
					color: canAccess ? "unset" : "#888",
					fontSize: 13,
					marginBottom: 4,
					cursor: clickable ? "pointer" : "unset",
				}}
			>
				<div
					css={[
						{
							width: 30,
						},
						styleCenterSingleChild,
					]}
				>
					<FontAwesomeIcon
						icon={type === "column" ? faFont : children ? faChevronDown : faChevronRight}
					/>
				</div>{" "}
				{node.name}
			</Button>
			{children && open && (
				<div
					css={{
						marginLeft: 20,
					}}
				>
					{reliablyGetValues(children).map((child) => (
						<NodeComponent node={child} openNode={openChildNode} />
					))}
				</div>
			)}
		</div>
	)
})

export default NodeComponent
