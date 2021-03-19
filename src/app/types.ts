export type NodeChildren = Record<string, NodeBranch>

export type NodeBranch = {
	name: string
	type: string
	children?: NodeChildren
} & {
	canAccess: boolean
}
