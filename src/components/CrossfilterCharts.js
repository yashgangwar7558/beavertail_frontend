import * as dc from 'dc'
import 'dc/dist/style/dc.min.css'
import * as d3 from 'd3'
import './CrossfilterCharts.css'


function remove_empty_bins(source_group) {
    return {
        all: function () {
            return source_group.all().filter((d) => {
                return Math.abs(d.value) > 0.00001
            })
        }
    };
}

export const mapChartFunc = (ref, cx, map, min, max) => {
    const mapDimension = cx.dimension(d => d.State)
    const mapGroup = mapDimension.group().reduceSum(d => d.Sales)

    const colorScale = d3.scaleQuantize()
        .range(["#CCE0FF", "#99C2FF", "#66A3FF", "#3385FF", "#0066FF", "#0052CC", "#003D99", "#002966"])
        .domain([0, max])

    const mapChart = dc.geoChoroplethChart(ref)
    mapChart
        .dimension(mapDimension)
        .group(mapGroup)
        .colors(colorScale)
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `State: ${d.key}, Total Sales: $${formattedValue}`
        })
        .projection(d3.geoAlbersUsa())
        .overlayGeoJson(map.features, "state", (d) => d.properties.name)

    return mapChart
}

export const timeSeriesChartFunc = (ref1, ref2, cx, min, max, minDate, maxDate) => {
    const timeSeriesDimension = cx.dimension((d) => d.month)
    const timeSeriesGroup = timeSeriesDimension.group().reduceSum((d) => d.Sales)

    const formatMonth = d3.timeFormat("%b '%y")

    const rangeChart = dc.barChart(ref2)
    rangeChart
        .dimension(timeSeriesDimension)
        .group(timeSeriesGroup)
        .centerBar(true)
        .gap(1)
        .xAxisLabel('Time Period')
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .round(d3.timeMonth.round)
        .alwaysUseRounding(true)
        .xUnits(d3.timeMonths)
        .margins({ top: 0, right: 0, bottom: 50, left: 70 })
        .xAxis().tickFormat((d) => formatMonth(d))

    const timeSeriesChart = dc.lineChart(ref1)
    timeSeriesChart
        .renderArea(true)
        .dimension(timeSeriesDimension)
        .group(timeSeriesGroup)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .round(d3.timeMonth.round)
        .xUnits(d3.timeMonths)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .yAxisLabel('Total Sales ($)')
        .title((d) => {
            const dateFormatter = d3.timeFormat('%b, %Y')
            const formattedDate = dateFormatter(d.key)
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `${formattedDate}: $${formattedValue}`
        })
        .margins({ top: 0, right: 0, bottom: 20, left: 70 })
        .brushOn(false)
        .mouseZoomable(true)
        .curve(d3.curveCardinal)
        .evadeDomainFilter(true)
        .rangeChart(rangeChart)
    timeSeriesChart.xAxis().tickFormat((d) => formatMonth(d))
    timeSeriesChart.yAxis().tickFormat((d) => d ? d3.format('.2s')(d) : 0)

    return [rangeChart, timeSeriesChart]
}

export const brandBarChartFunc = (ref, cx, min, max) => {
    const brandDimension = cx.dimension((d) => d.Brand)
    const brandGroup = brandDimension.group().reduceSum((d) => d.Sales)

    const brandBarChart = dc.rowChart(ref)
    brandBarChart
        .dimension(brandDimension)
        .group(brandGroup)
        .x((d3.scaleLinear().domain([0, d3.max(brandGroup.all(), (d) => d.value)])))
        .elasticX(true)
        .cap(10)
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `Brand: ${d.key}, Total Sales: $${formattedValue}`
        })
        .controlsUseVisibility(true)
        .addFilterHandler((filters, filter) => [filter])
        .xAxis().ticks(5).tickFormat((d) => d ? d3.format('.2s')(d) : 0)

    return brandBarChart
}

export const retailerBarChartFunc = (ref, cx, min, max) => {
    const retailerDimension = cx.dimension((d) => d.Retailer)
    const retailerGroup = retailerDimension.group().reduceSum((d) => d.Sales)

    const retailerBarChart = dc.rowChart(ref)
    retailerBarChart
        .dimension(retailerDimension)
        .group(retailerGroup)
        .x((d3.scaleLinear().domain([0, d3.max(retailerGroup.all(), (d) => d.value)])))
        .elasticX(true)
        .cap(10)
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `Retailer: ${d.key}, Total Sales: $${formattedValue}`
        })
        .controlsUseVisibility(true)
        .addFilterHandler((filters, filter) => [filter])
        .xAxis().ticks(5).tickFormat((d) => d ? d3.format('.2s')(d) : 0)

    return retailerBarChart
}

export const categoryBarChartFunc = (ref, cx, min, max) => {
    const categoryDimension = cx.dimension((d) => d.Category)
    const categoryGroup = categoryDimension.group().reduceSum((d) => d.Sales)

    const categoryBarChart = dc.rowChart(ref)
    categoryBarChart
        .dimension(categoryDimension)
        .group(categoryGroup)
        .x((d3.scaleLinear().domain([0, d3.max(categoryGroup.all(), (d) => d.value)])))
        .elasticX(true)
        .cap(10)
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `Category: ${d.key}, Total Sales: $${formattedValue}`
        })
        .controlsUseVisibility(true)
        .addFilterHandler((filters, filter) => [filter])
        .xAxis().ticks(5).tickFormat((d) => d ? d3.format('.2s')(d) : 0)

    return categoryBarChart
}

export const itemBarChartFunc = (ref, cx, min, max) => {
    const itemDimension = cx.dimension((d) => d.Item)
    const itemGroup = itemDimension.group().reduceSum((d) => d.Sales)

    const itemBarChart = dc.rowChart(ref)
    itemBarChart
        .dimension(itemDimension)
        .group(itemGroup)
        .x((d3.scaleLinear().domain([0, d3.max(itemGroup.all(), (d) => d.value)])))
        .elasticX(true)
        .cap(10)
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `Item: ${d.key}, Total Sales: $${formattedValue}`
        })
        .controlsUseVisibility(true)
        .addFilterHandler((filters, filter) => [filter])
        .xAxis().ticks(5).tickFormat((d) => d ? d3.format('.2s')(d) : 0)

    return itemBarChart
}
export const itemMarBarChartFunc = (ref, cx, min, max) => {
    const itemDimension = cx.dimension((d) => d.Item)
    const itemGroup = itemDimension.group().reduceSum((d) => d.Margins)

    const itemBarChart = dc.rowChart(ref)
    itemBarChart
        .dimension(itemDimension)
        .group(itemGroup)
        .x((d3.scaleLinear().domain([0, d3.max(itemGroup.all(), (d) => d.value)])))
        .elasticX(true)
        .cap(10)
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `Item: ${d.key}, Total Sales: $${formattedValue}`
        })
        .controlsUseVisibility(true)
        .addFilterHandler((filters, filter) => [filter])
        .xAxis().ticks(5).tickFormat((d) => d ? d3.format('.2s')(d) : 0)

    return itemBarChart
}

// export const countyPieChartFunc = (ref, cx, min, max) => {
//     const countyDimension = cx.dimension((d) => d.County)
//     const countyGroup = countyDimension.group().reduceSum((d) => d.Sales)

//     const countyPieChart = dc.pieChart(ref)
//     countyPieChart
//         .dimension(countyDimension)
//         .group(remove_empty_bins(countyGroup))
//         .slicesCap(5)
//         .renderLabel(false)
//         // .innerRadius(100)
//         .legend(dc.legend().highlightSelected(true).y(10))
//         .title((d) => {
//             const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
//             return `County: ${d.key}, Total Sales: $${formattedValue}`
//         })
//         .on('pretransition', (chart) => {
//             const totalSales = chart.group().all().reduce((acc, curr) => acc + curr.value, 0)
//             chart.selectAll('.dc-legend-item text')
//                 .text((d) => {
//                     var percentage = (d.data / totalSales) * 100
//                     return d.name + ' - ' + percentage.toFixed(1) + '%'
//                 })
//         })


//     return countyPieChart
// }


export const agePieChartFunc = (ref, cx, min, max) => {
    const ageDimension = cx.dimension((d) => d.AgeCategory)
    const ageGroup = ageDimension.group().reduceSum((d) => d.Sales)

    const agePieChart = dc.pieChart(ref)
    agePieChart
        .dimension(ageDimension)
        .group(remove_empty_bins(ageGroup))
        .slicesCap(5)
        .renderLabel(false)
        // .innerRadius(100)
        .legend(dc.legend().highlightSelected(true).y(10))
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `County: ${d.key}, Total Sales: $${formattedValue}`
        })
        .on('pretransition', (chart) => {
            const totalSales = chart.group().all().reduce((acc, curr) => acc + curr.value, 0)
            chart.selectAll('.dc-legend-item text')
                .text((d) => {
                    var percentage = (d.data / totalSales) * 100
                    return d.name + ' - ' + percentage.toFixed(1) + '%'
                })
        })

    return agePieChart
}

export const cityPieChartFunc = (ref, cx, min, max) => {
    const cityDimension = cx.dimension((d) => d.CityName)
    const cityGroup = cityDimension.group().reduceSum((d) => d.Sales)

    const cityPieChart = dc.pieChart(ref)
    cityPieChart
        .dimension(cityDimension)
        .group(remove_empty_bins(cityGroup))
        .slicesCap(5)
        .renderLabel(false)
        .innerRadius(100)
        // .externalLabels(30)
        // .externalRadiusPadding(40)
        // .drawPaths(true)
        .legend(dc.legend().highlightSelected(true).y(10))
        .title((d) => {
            const formattedValue = d.value ? d3.format('.2s')(d.value) : 0
            return `City: ${d.key}, Total Sales: $${formattedValue}`
        })
        .on('pretransition', (chart) => {
            const totalSales = chart.group().all().reduce((acc, curr) => acc + curr.value, 0)
            chart.selectAll('.dc-legend-item text')
                .text((d) => {
                    var percentage = (d.data / totalSales) * 100
                    return d.name + ' - ' + percentage.toFixed(1) + '%'
                })
        })

    return cityPieChart
}

export const dataTableFunc = (ref, cx) => {
    const tableDimension = cx.dimension((d) => d.date)

    const dataTable = dc.dataTable(ref)
    dataTable
        .dimension(tableDimension)
        .columns(['InvoiceNo', {
            label: 'Date',
            format: (d) => {
                var dateFormat = d3.format('02d')
                return dateFormat((d.date.getDate())) + '/' + dateFormat((d.date.getMonth() + 1)) + '/' + d.date.getFullYear()
            }
        },
            { label: 'Menu-Item', format: (d) => d.Item },
            { label: 'Menu-Category', format: (d) => d.Category },
            { label: 'Store', format: (d) => d.AgeCategory },
            'State',
            {
                label: 'City',
                format: (d) => d.CityName
            },
            {
                label: 'Total',
                format: (d) => `$${d.Sales.toFixed(2)}`
            },
            {
                label: 'Margin',
                format: (d) => `$${d.Margins.toFixed(2)}`
            }
        ])
        .sortBy((d) => d.date)
        .order(d3.ascending)
        .on('renderlet', (table) => {
            table.selectAll('.dc-table-group').classed('info', true)
        })

    return dataTable
}