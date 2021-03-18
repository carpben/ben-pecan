import { NodeBranch, NodeChildren } from "../app/types"
import { getNode, pathKeys } from "./mock"

const testAccess = (keys: string[]) => {
	const levelTested = pathKeys[keys.length]

	test(`testing ${levelTested}`, () => {
		const result = getNode(keys)
		expect(result.success).toBeTruthy()
		const children = result.children as NodeChildren
		expect(typeof children === "object").toBeTruthy() // "could be null or array"

		const childrenKeys = Object.keys(children)
		const firstChild = children[childrenKeys[0]]

		expect(firstChild.type).toEqual(levelTested)
		expect(firstChild.children).toBe(undefined)
	})
}

testAccess([])
testAccess(["connection_1"])
testAccess(["connection_1", "database_1", "schema_1", "table_1"])
