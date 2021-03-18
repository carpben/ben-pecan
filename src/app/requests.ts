import { getNode } from "../api/mock"
import { NodeChildren } from "./types"

export const requestChildren = (keys: string[]) =>
	new Promise((resolve, reject) => {
		setTimeout(() => {
			const result = getNode(keys)
			if (!result.success) {
				reject(result.message)
			} else {
				resolve(result.children)
			}
		}, 100)
	})
