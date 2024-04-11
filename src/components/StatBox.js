import React from 'react'
import ProgressCircle from './ProgressCircle'
import { Box, Typography } from '@mui/material'
import styled from 'styled-components'


const StatBoxWrapper = styled(Box)`
    width: 100%;
    margin: 0px 30px;
`

const StatBox = (props) => {
    return (
        <StatBoxWrapper>
            <Box display='flex' justifyContent='space-between' margin='5px'>
                <Box display='flex' flexDirection='column' justifyContent='space-between'>
                    <Typography variant="h7" fontWeight='bold' color='#121B28' fontFamily='inherit'>
                        {props.subtitle}
                    </Typography>

                    <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                        <Typography variant='h6' fontWeight='bold' color='#047c44' fontFamily='inherit'>
                            {props.title}
                        </Typography>
                        {props.percentChange != 0 && (
                            <Typography variant='h8' fontWeight='bold' color={props.color} fontFamily='inherit' style={{ marginLeft: '10px', fontSize: '12px' }}>
                                {props.percentIcon}
                                {props.percentChange}%
                            </Typography>
                        )}
                    </Box>

                    <Typography variant="h7" fontWeight='bold' color='#121B28' fontFamily='inherit'>
                        {props.subtitle1}
                    </Typography>

                    <Box display='flex' justifyContent='flex-start' alignItems='center'>
                        <Typography variant='h6' fontWeight='bold' color='#047c44' fontFamily='inherit'>
                            {props.title1}
                        </Typography>
                        {props.percentChange1 != 0 && (
                            <Typography variant='h8' fontWeight='bold' color={props.color1} fontFamily='inherit' style={{ marginLeft: '10px', fontSize: '12px' }}>
                                {props.percentIcon1}
                                {props.percentChange1}%
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box display='flex' flexDirection='column' justifyContent='space-between'>
                    {props.icon}
                    {/* <ProgressCircle progress={props.progress} />
                    <Typography variant='body2' fontStyle='italic' color='#047c44' fontFamily='inherit'>
                        {props.percentIncrease}
                    </Typography> */}
                </Box>
            </Box>
        </StatBoxWrapper>
    )
}

export default StatBox