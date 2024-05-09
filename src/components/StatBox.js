import React from 'react'
import ProgressCircle from './ProgressCircle'
import { Box, Typography, Divider } from '@mui/material'
import styled from 'styled-components'


const StatBoxWrapper = styled(Box)`
    width: 100%;
    margin: 10px 20px;
`

const StatBox = (props) => {
    return (
        <StatBoxWrapper>
            <Box display='flex' justifyContent='space-between' margin='5px'>
                <Box display='flex' flexDirection='column' justifyContent='space-between'>

                    <Typography variant="body" fontWeight='bold' color='#121B28' fontFamily='inherit' style={{ fontSize: '14px' }}>
                        {props.subtitle}
                    </Typography>
                    <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                        <Typography variant='h6' fontWeight='bold' color='#047c44' fontFamily='inherit'>
                            ${(props.title).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Typography>
                        {props.percentChange != 0 && (
                            <Typography variant='body' fontWeight='bold' color={props.color} fontFamily='inherit' style={{ marginLeft: '10px', fontSize: '12px' }}>
                                {props.percentIcon}
                                {props.percentChange}%
                            </Typography>
                        )}
                    </Box>

                    <Divider style={{ margin: '10px 0px', flex: 1, width: '100%' }} />

                    <Typography variant="body" fontWeight='bold' color='#121B28' fontFamily='inherit' style={{ fontSize: '14px' }}>
                        {props.subtitle1}
                    </Typography>
                    <Box display='flex' justifyContent='flex-start' alignItems='center'>
                        <Typography variant='h6' fontWeight='bold' color='#047c44' fontFamily='inherit'>
                            ${(props.title1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Typography>
                        {props.percentChange1 != 0 && (
                            <Typography variant='body' fontWeight='bold' color={props.color1} fontFamily='inherit' style={{ marginLeft: '10px', fontSize: '12px' }}>
                                {props.percentIcon1}
                                {props.percentChange1}%
                            </Typography>
                        )}
                    </Box>

                </Box>

                <Box display='flex' flexDirection='column' justifyContent='space-between'>
                    {/* {props.icon} */}
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