import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import crossfilter from 'crossfilter2/crossfilter'
import * as dc from 'dc'
import 'dc/dist/style/dc.min.css'
import csv from '../../utils/analytics-Pdatabase.csv'
// import csv from '../../utils/test-data.csv'
import map from '../../utils/us-states.json'
import { Box, Grid, Button } from '@mui/material'
import { mapChartFunc, timeSeriesChartFunc, brandBarChartFunc, retailerBarChartFunc, categoryBarChartFunc, itemBarChartFunc, agePieChartFunc, cityPieChartFunc, dataTableFunc } from '../../components/CrossfilterCharts'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

const AnalyticsDashboardGrid = styled(Grid)`
    width: 100%;
    padding-left: 10px;
`
const ChartGrid = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    width: 100%;
    height: ${(props) => props.bar ? '300px' : '350px'};
`
const TableGrid = styled(Box)`
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    width: 100%;
    height: auto;
    overflow-y: auto;
`
const ChartTitle = styled(Box)`
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-top: 5px;
    margin-bottom: 10px;
`
const ChartHeader = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`

const AnalyticsPurchases = (props) => {
    const [cx, setCx] = useState(null)

    const [minSales, setMinSales] = useState(Number.POSITIVE_INFINITY)
    const [maxSales, setMaxSales] = useState(Number.NEGATIVE_INFINITY)

    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)

    const mapChartRef = useRef(null)
    const timeSeriesChartRef = useRef(null)
    const rangeChartRef = useRef(null)
    const brandBarChartRef = useRef(null)
    const retailerBarChartRef = useRef(null)
    const categoryBarChartRef = useRef(null)
    const itemBarChartRef = useRef(null)
    // const countyPieChartRef = useRef(null)
    const agePieChartRef = useRef(null)
    const cityPieChartRef = useRef(null)
    const dataTableRef = useRef(null)

    const timeSeriesContainerRef = useRef(null)

    const [mapChartContainerSize, setMapChartContainerSize] = useState({ width: 0, height: 0 })
    const [timeSeriesContainerSize, setTimeSeriesContainerSize] = useState({ width: 0, height: 0 })
    const [brandBarChartContainerSize, setBrandBarChartContainerSize] = useState({ width: 0, height: 0 })
    const [retailerBarChartContainerSize, setRetailerBarChartContainerSize] = useState({ width: 0, height: 0 })
    const [categoryBarChartContainerSize, setCategoryBarChartContainerSize] = useState({ width: 0, height: 0 })
    const [itemBarChartContainerSize, setItemBarChartContainerSize] = useState({ width: 0, height: 0 })
    // const [countyPieChartContainerSize, setCountyPieChartContainerSize] = useState({width: 0, height: 0})
    const [agePieChartContainerSize, setAgePieChartContainerSize] = useState({ width: 0, height: 0 })
    const [cityPieChartContainerSize, setCityPieChartContainerSize] = useState({ width: 0, height: 0 })
    const [dataTableContainerSize, setDataTableContainerSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        (async () => {
            const data = await d3.csv(csv)
            const dateFormatParser = d3.timeParse('%d/%m/%Y %H:%M')

            data.forEach((d) => {
                d.Sales = +(d.Total.slice(1).replace(/\,/g, ''))
                d.date = dateFormatParser(d.InvoiceDate)
                d.month = d3.timeMonth(d.date)
            })

            var salesValues = data.map(d => d.Sales)
            setMinSales(Math.floor(Math.min(...salesValues) / 1000) * 1000)
            setMaxSales(Math.ceil(Math.max(...salesValues) / 1000) * 1000)

            var dates = data.map((d) => d.date);
            setMinDate(d3.timeYear.floor(d3.min(dates)))
            setMaxDate(d3.timeYear.ceil(d3.max(dates)))

            const cx = crossfilter(data)
            setCx(cx)
        })()
    }, [])

    const getParentSize = (parentContainerRef) => {
        if (parentContainerRef && parentContainerRef.current) {
            const { width, height } = parentContainerRef.current.getBoundingClientRect()
            return { width, height }
        }
    }

    const setParentSizes = () => {
        setMapChartContainerSize(getParentSize(mapChartRef))
        setTimeSeriesContainerSize(getParentSize(timeSeriesContainerRef))
        setBrandBarChartContainerSize(getParentSize(brandBarChartRef))
        setRetailerBarChartContainerSize(getParentSize(retailerBarChartRef))
        setCategoryBarChartContainerSize(getParentSize(categoryBarChartRef))
        setItemBarChartContainerSize(getParentSize(itemBarChartRef))
        // setCountyPieChartContainerSize(getParentSize(countyPieChartRef))
        setAgePieChartContainerSize(getParentSize(agePieChartRef))
        setCityPieChartContainerSize(getParentSize(cityPieChartRef))
        setDataTableContainerSize(getParentSize(dataTableRef))
    }

    useEffect(() => {
        if (cx) {
            dc.chartRegistry.clear()

            const mapChart = mapChartFunc(mapChartRef.current, cx, map, minSales, maxSales)
            const timeSeriesChart = timeSeriesChartFunc(timeSeriesChartRef.current, rangeChartRef.current, cx, minSales, maxSales, minDate, maxDate)
            const brandBarChart = brandBarChartFunc(brandBarChartRef.current, cx, minSales, maxSales)
            const retailerBarChart = retailerBarChartFunc(retailerBarChartRef.current, cx, minSales, maxSales)
            const categoryBarChart = categoryBarChartFunc(categoryBarChartRef.current, cx, minSales, maxSales)
            const itemBarChart = itemBarChartFunc(itemBarChartRef.current, cx, minSales, maxSales)
            // const countyPieChart = countyPieChartFunc(countyPieChartRef.current, cx, minSales, maxSales)
            const agePieChart = agePieChartFunc(agePieChartRef.current, cx, minSales, maxSales)
            const cityPieChart = cityPieChartFunc(cityPieChartRef.current, cx, minSales, maxSales)
            // const dataTable = dataTableFunc(dataTableRef.current, cx, minSales, maxSales)

            dc.renderAll()

            const handleResize = debounce(() => {
                setParentSizes()

                if (agePieChartContainerSize.width < 600 || cityPieChartContainerSize.width < 600) {
                    agePieChart.radius(90)
                    cityPieChart.radius(90).innerRadius(55)
                }

                if (mapChartContainerSize.width < 300) {
                    mapChart.width(mapChartContainerSize.width * 0.9).projection(d3.geoAlbersUsa().scale(350).translate([mapChart.width() / 2, mapChart.height() / 2 - 30]))
                }
                else if (mapChartContainerSize.width < 475) {
                    mapChart.width(mapChartContainerSize.width * 0.9).projection(d3.geoAlbersUsa().scale(525).translate([mapChart.width() / 2, mapChart.height() / 2 - 30]))
                }
                else if (mapChartContainerSize.width < 1200 && mapChartContainerSize.width > 600) {
                    mapChart.width(mapChartContainerSize.width * 0.9).projection(d3.geoAlbersUsa().scale(650).translate([mapChart.width() / 2, mapChart.height() / 2 - 30]))
                }
                else {
                    mapChart.width(mapChartContainerSize.width * 0.9).projection(d3.geoAlbersUsa().scale(625).translate([mapChart.width() / 2, mapChart.height() / 2 - 30]))
                }

                timeSeriesChart[1].width(timeSeriesContainerSize.width * 0.9).height(200)
                timeSeriesChart[0].width(timeSeriesContainerSize.width * 0.9).height(80)
                brandBarChart.width(brandBarChartContainerSize.width).height(250)
                retailerBarChart.width(retailerBarChartContainerSize.width).height(250)
                categoryBarChart.width(categoryBarChartContainerSize.width).height(250)
                itemBarChart.width(itemBarChartContainerSize.width).height(250)
                // countyPieChart.width(countyPieChartContainerSize.width * 0.9).height(300)
                agePieChart.width(agePieChartContainerSize.width * 0.9).height(300)
                cityPieChart.width(cityPieChartContainerSize.width * 0.9).height(300)

                dc.renderAll()
            }, 100)

            handleResize()

            window.addEventListener('resize', handleResize)
            return () => {
                window.removeEventListener('resize', handleResize)
                dc.chartRegistry.clear()
            }
        }
    }, [props.renderDashboard, cx, mapChartContainerSize.width, timeSeriesContainerSize.width, brandBarChartContainerSize.width, retailerBarChartContainerSize.width, categoryBarChartContainerSize.width, itemBarChartContainerSize.width, agePieChartContainerSize.width, cityPieChartContainerSize.width])

    const handleResetClick = () => {
        dc.filterAll()
        dc.renderAll()
    }

    return (
        <AnalyticsDashboardGrid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <ChartGrid id="mapChart" ref={mapChartRef}>
                    <ChartHeader>
                        <ChartTitle className='chart-title'>Regional Statistics |</ChartTitle>
                        <Button sx={{ textTransform: 'none' }} onClick={handleResetClick}>reset</Button>
                    </ChartHeader>
                </ChartGrid>
            </Grid>
            <Grid item xs={12} lg={6}>
                <ChartGrid ref={timeSeriesContainerRef}>
                    <ChartHeader>
                        <ChartTitle className="chart-title">Total Sales |</ChartTitle>
                        <Button sx={{ textTransform: 'none' }} onClick={handleResetClick}>reset</Button>
                    </ChartHeader>
                    <div id="timeSeriesChart" ref={timeSeriesChartRef} />
                    <div id="rangeChart" ref={rangeChartRef} />
                </ChartGrid>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <ChartGrid bar id="retailerBarChart" ref={retailerBarChartRef}>
                    <ChartTitle className="chart-title">Top 10 Category</ChartTitle>
                </ChartGrid>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <ChartGrid bar id="brandBarChart" ref={brandBarChartRef}>
                    <ChartTitle className="chart-title">Top 10 Menu-Item</ChartTitle>
                </ChartGrid>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <ChartGrid bar id="categoryBarChart" ref={categoryBarChartRef}>
                    <ChartTitle className="chart-title">Top 10 Categories</ChartTitle>
                </ChartGrid>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <ChartGrid bar id="itemBarChart" ref={itemBarChartRef}>
                    <ChartTitle className="chart-title">Top 10 Items</ChartTitle>
                </ChartGrid>
            </Grid>
            {/* <Grid item xs={12} lg={6}>
                <ChartGrid pie id="countyPieChart" ref={countyPieChartRef}>
                    <ChartHeader>
                        <ChartTitle className="chart-title">County-wise Sales Distribution |</ChartTitle>
                        <Button sx={{textTransform: 'none'}} onClick={handleResetClick}>reset</Button>
                    </ChartHeader>
                </ChartGrid>
            </Grid> */}
            <Grid item xs={12} lg={6}>
                <ChartGrid pie id="agePieChart" ref={agePieChartRef}>
                    <ChartHeader>
                        <ChartTitle className="chart-title">Age-wise Distribution |</ChartTitle>
                        <Button sx={{ textTransform: 'none' }} onClick={handleResetClick}>reset</Button>
                    </ChartHeader>
                </ChartGrid>
            </Grid>
            <Grid item xs={12} lg={6}>
                <ChartGrid pie id="cityPieChart" ref={cityPieChartRef}>
                    <ChartHeader>
                        <ChartTitle className="chart-title">City-wise Sales Distribution |</ChartTitle>
                        <Button sx={{ textTransform: 'none' }} onClick={handleResetClick}>reset</Button>
                    </ChartHeader>
                </ChartGrid>
            </Grid>
            <Grid item xs={12}>
                <TableGrid id="dataTable" ref={dataTableRef} />
            </Grid>
        </AnalyticsDashboardGrid>
    )
}

export default AnalyticsPurchases
