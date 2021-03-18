export const reliablyGetEntries = Object.entries as <T extends object>(obj: T) => Array<[keyof T, T[keyof T]]>
// const getObjectKeys = <O extends object>(obj:O) => Object.keys(obj) as Array<keyof O>
export const reliablyGetValues = Object.values as <T extends object>(obj: T) => Array<T[keyof T]>
