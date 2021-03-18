/** @jsxImportSource @emotion/react */
import { css, Interpolation, jsx, Theme } from "@emotion/react"
import { styleInputNormalize } from "../styles"
import { DRFC } from "../types"

interface Props {
	handler: () => unknown
	stl?: Interpolation<Theme>
}

export const Button: DRFC<Props> = (props) => {
	const { handler, stl, ...otherProps } = props
	return <button onClick={handler} css={[style, stl]} {...otherProps} />
}

const style = css(styleInputNormalize, { cursor: "pointer" })
