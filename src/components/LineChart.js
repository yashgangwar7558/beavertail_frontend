import React from 'react'
import { LineChartData } from '../utils/ChartData'
import { ResponsiveLine } from '@nivo/line'

const LineChart = (props) => {
    const lineChartData = LineChartData()
    return (
        <ResponsiveLine
            data={lineChartData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: '#121B28'
                        }
                    },
                    legend: {
                        text: {
                            fill: '#121B28',
                            fontFamily: 'inherit'
                        }
                    },
                    ticks: {
                        line: {
                            stroke: '#121B28',
                            strokeWidth: 1
                        },
                        text: {
                            fill: '#121B28',
                            fontFamily: 'inherit'
                        }
                    }
                },
                legends: {
                    text: {
                        fill: '#121B28',
                        fontFamily: 'inherit'
                    }
                },
                tooltip: {
                    container: {
                        color: '#121B28'
                    }
                }
            }}
            colors={{ scheme: "category10" }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: props.winWidth <= 450 ? -90 : 0,
                legend: undefined,
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickValues: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: undefined,
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    )
}

export default LineChart