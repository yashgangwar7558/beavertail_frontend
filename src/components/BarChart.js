import React from 'react'
import { BarChartData, RecipeTypes } from '../utils/ChartData'
import { ResponsiveBar } from '@nivo/bar'

const BarChart = (props) => {
    const barChartData = BarChartData()
    const types = RecipeTypes()
    return (
        <ResponsiveBar
            data={barChartData}
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
                            strokeWidth: 1,
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
                    },
                }
            }}
            keys={[
                // 'Burger',
                // 'Chinese',
                // 'Main Course',
                // 'Mocktail',
                // 'Pizza',
                // 'Rolls',
                // 'Shakes',
                // 'Snacks'
                'Food',
                'Beverage'
            ]}
            indexBy="month"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            groupMode="grouped"
            colors={{ scheme: 'nivo' }}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: props.winWidth >= 525 && props.winWidth <= 1024 ? 0 : -90,
                legend: undefined,
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickValues: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: undefined,
                legendPosition: 'middle',
                legendOffset: -40
            }}
            enableGridX={false}
            enableGridY={false}
            enableLabel={false}
            labelSkipWidth={5}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
        />
    )
}

export default BarChart