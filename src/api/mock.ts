import { NodeChildren } from "../app/types"
import mockConfig from "./mockConfig"

export const reliablyGetEntries = Object.entries as <T extends object>(obj: T) => Array<[keyof T, T[keyof T]]>

export const mapObj = <K extends string, V extends any, T extends any>(
	obj: Record<K, V>,
	mapper: (val: V, key: K) => T,
): Record<K, T> => {
	const ret: any = {}
	reliablyGetEntries(obj).forEach(([k, v]) => {
		ret[k] = mapper(v, k)
	})

	return ret
}

const getChildren = (count: number, type: string): NodeChildren =>
	Array.from(new Array(count)).reduce((accum, val, i) => {
		const name = `${type}_${i}`

		return {
			...accum,
			[name]: {
				type,
				name,
				canAccess: mockConfig.canAccess(i),
			},
		}
	}, {})

const initialData: NodeChildren = getChildren(mockConfig.childrenCount, "connection")

const dbMock = initialData

export const pathKeys = ["connection", "database", "schema", "table", "column"]

export const getNode = (path: string[]) => {
	if (path.length > 4) {
		return {
			success: false,
			message: "invalid key list",
		}
	}

	let dataAhead: NodeChildren = { ...dbMock }
	let pathAhead = [...path]

	let i = 0
	while (pathAhead.length) {
		const key = pathAhead.shift() as string

		if (dataAhead[key]) {
			const newNode = dataAhead[key]
			if (newNode.canAccess) {
				if (!newNode.children) {
					newNode.children = getChildren(mockConfig.childrenCount, pathKeys[i + 1])
				}

				dataAhead = newNode.children
			} else {
				return {
					success: false,
					message: "no access",
				}
			}
		} else {
			return {
				success: false,
				message: "no such key",
			}
		}
		i++
	}

	return {
		success: true,
		children: mapObj(dataAhead, (node) => ({
			...node,
			children: undefined,
		})),
	}
}
