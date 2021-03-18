import { EffectCallback, useEffect } from "react"

export const useMountEffect = (fun: EffectCallback) => {
	return useEffect(fun, [])
}
