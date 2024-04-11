import React from 'react'
import { Box } from '@mui/material'


const ProgressCircle = (props) => {

	const angle = props.progress * 360

	return (
		<Box 
		sx = {{
			background: `radial-gradient(#ffffff 55%, transparent 56%),
				conic-gradient(transparent 0deg ${angle}deg, #121B28 ${angle}deg 360deg),
				#047c44`,
			borderRadius: '50%',
			width: '40px',
			height: '40px'
		}}
		/>
	)
}

export default ProgressCircle