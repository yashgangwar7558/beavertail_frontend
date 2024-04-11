import { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'

const useParentSize = (parentContainerRef, renderDashboard) => {
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
		const getParentSize = () => {
			if (parentContainerRef && parentContainerRef.current) {
				const { width, height } = parentContainerRef.current.getBoundingClientRect()
				setParentSize({ width, height });
			}
		}
		getParentSize()

		const handleResize = debounce(() => {
			getParentSize()
		}, 100)

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}  
    }, [parentContainerRef, renderDashboard]);

    return parentSize
}

export default useParentSize
