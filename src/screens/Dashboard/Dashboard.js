import React from 'react'
import StatBox from '../../components/StatBox'
import { StatBoxData } from '../../utils/StatBoxData'
import { LineChartHeaderData } from '../../utils/ChartData'
import { TopPurchasesValueWise, PurchasesTopChange, SalesLastSevenDays, TopCategoriesSalesMonth, TopCategoriesSalesToday, TopItemsSalesMonth, TopItemsSalesToday } from '../../utils/DashTableData'
import { TopRecipesCarouselData, TopTypesCarouselData, TopPurchasedIngredientsCarouselData, TopVendorsCarouselData } from '../../utils/CarouselData'
import LineChart from '../../components/LineChart'
import BarChart from '../../components/BarChart'
import ImageCarousel from '../../components/ImageCarousel'
import useWindowDimensions from '../../utils/windowDimensions'
import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper } from '@mui/material'
import { PaidRounded, PointOfSaleRounded } from '@mui/icons-material'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import styled from 'styled-components'

const DashboardGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-template-rows: 1fr 2fr 2fr;
	grid-auto-rows: auto;
	height: calc(100vh - 72px);
	gap: 15px;
	margin: 15px 15px;

	@media screen and (max-width: 1024px) {
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: 1fr 2fr 2fr 2fr 2fr;
    }

	@media screen and (max-width: 770px) {
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: 1fr 1fr 2fr 2fr 2fr 2fr;
    }

	@media screen and (max-width: 600px) {
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: 1fr 1fr 1fr 1fr 2fr 2fr 2fr 2fr;
    }
`
const StatBoxGrid = styled(Box)`
	grid-column: span 3;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	border-radius: 20px;

	@media screen and (max-width: 770px) {
		grid-column: span 6;
    }

	@media screen and (max-width: 600px) {
		grid-column: span 12;
    }
`
const LineChartGrid = styled(Box)`
	grid-column: span 6;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	border-radius: 20px;

	@media screen and (max-width: 1024px) {
		grid-column: span 12;
    }
`
const BarChartGrid = styled(Box)`
  grid-column: span 6;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 20px;

  @media screen and (max-width: 1024px) {
    grid-column: span 12;
    }
`
const ChartHeader = styled(Box)`
	margin-top: 10px;
	padding: 0px 30px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`
const TableGrid1 = styled(Box)`
	grid-column: span 6;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	border-radius: 20px;

	@media screen and (max-width: 770px) {
		grid-column: span 6;
    }

	@media screen and (max-width: 600px) {
		grid-column: span 12;
    }
`
const TableGrid2 = styled(Box)`
	grid-column: span 3;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	border-radius: 20px;

	@media screen and (max-width: 770px) {
		grid-column: span 6;
    }

	@media screen and (max-width: 600px) {
		grid-column: span 12;
    }
`
const TableHeader = styled(Box)`
	margin-top: 10px;
	padding: 0px 15px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
`

const Dashboard = (props) => {

  const { width, height } = useWindowDimensions()
  const statBoxData = StatBoxData()
  const lineChartHeaderData = LineChartHeaderData()
  const topRecipesCarouselData = TopRecipesCarouselData()
  const topTypesCarouselData = TopTypesCarouselData()
  const topPurchasedIngredientsCarouselData = TopPurchasedIngredientsCarouselData()
  const topVendorsCarouselData = TopVendorsCarouselData()
  const topPurchasesValueWise = TopPurchasesValueWise()
  const purchasesTopChange = PurchasesTopChange()
  const salesLastSevenDays = SalesLastSevenDays()
  const topCategoriesSalesMonth = TopCategoriesSalesMonth()
  const topCategoriesSalesToday = TopCategoriesSalesToday()
  const topItemsSalesMonth = TopItemsSalesMonth()
  const topItemsSalesToday = TopItemsSalesToday()

  return (
    <DashboardGrid>
      {statBoxData.map((item, index) => {
        return (
          <StatBoxGrid>
            <StatBox
              title={item.title}
              subtitle={item.subtitle}
              percentIcon={item.percentIcon}
              percentChange={item.percentChange}
              color={item.color}
              title1={item.title1}
              subtitle1={item.subtitle1}
              percentIcon1={item.percentIcon1}
              percentChange1={item.percentChange1}
              color1={item.color1}
              icon={item.icon}
            />
          </StatBoxGrid>
        )
      })}

      <LineChartGrid>
        <ChartHeader>
          {/* {
            lineChartHeaderData.map((item) => {
              return (
                <Box>
                  <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
                    {item.title}
                  </Typography>
                  <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#047c44'>
                    {item.subtitle}
                  </Typography>
                </Box>
              )
            }
            )
          } */}
          <Box>
            <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
              {lineChartHeaderData[0].title}
            </Typography>
            <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#047c44'>
              {lineChartHeaderData[0].subtitle}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
              {lineChartHeaderData[1].title}
            </Typography>
            <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#047c44'>
              {lineChartHeaderData[1].subtitle}
            </Typography>
          </Box>
          <Box>
            <PaidOutlinedIcon sx={{ color: '#047c44', fontSize: '36px' }} />
          </Box>
        </ChartHeader>
        <Divider style={{ margin: '8px 0px', flex: 1, width: '100%' }} />
        <Box height="225px" mt="-25px" mb="10px">
          <LineChart winWidth={width} />
        </Box>
      </LineChartGrid>

      <BarChartGrid>
        <ChartHeader>
          <Box>
            <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
              {lineChartHeaderData[2].title}
            </Typography>
            <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#047c44'>
              {lineChartHeaderData[2].subtitle}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
              Food & Beverage Breakdown
            </Typography>
          </Box>
          <Box>
            <PaidOutlinedIcon sx={{ color: '#047c44', fontSize: '36px' }} />
          </Box>
        </ChartHeader>
        <Divider style={{ margin: '10px 0px', flex: 1, width: '100%' }} />
        <Box height="225px" mt="-30px" mb="10px">
          <BarChart winWidth={width} />
        </Box>
      </BarChartGrid>

      {/* <ImageCarousel title='Top Items with Highest Margin' data={topRecipesCarouselData.topMargin} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Items with Highest Sell' data={topRecipesCarouselData.topSales} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Categories with Highest Margin' data={topTypesCarouselData.topMargin} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Categories with Highest Sell' data={topTypesCarouselData.topSales} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Ingredients Bought this week' data={topPurchasedIngredientsCarouselData.topIngredients} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Vendors' data={topVendorsCarouselData.topVendors} renderCarousel={props.renderCarousel} winWidth={width} /> */}

      <TableGrid1>
        <TableHeader>
          <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
            Purchases - Value Wise
          </Typography>
        </TableHeader>
        <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />
        <TableContainer style={{ overflow: 'hidden' }}>
          <Table size='small' aria-label="a dense table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f2f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}># of Invoices</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Invoice Value ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                topPurchasesValueWise.map((item, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f0f0' }}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.invoiceCount}</TableCell>
                    <TableCell>${item.invoiceValue}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </TableGrid1>

      <TableGrid1>
        <TableHeader>
          <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
            Purchases - Top Change
          </Typography>
        </TableHeader>
        <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />
        <TableContainer>
          <Table size='small' aria-label="a dense table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f2f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Vendor</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Item</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Value Impact ($)</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Change (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                purchasesTopChange.map((item, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f0f0' }}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>${item.value_impact}</TableCell>
                    <TableCell>{item.change}%</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </TableGrid1>

      {/* <TableGrid1>
        <TableHeader>
          <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
            Sales
          </Typography>
          <Typography variant="body2" fontFamily='inherit' fontWeight='600' marginTop='5px' marginLeft='5px'>
            (Last 7 Days)
          </Typography>
        </TableHeader>
        <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />
        <TableContainer>
          <Table size='small' aria-label="a dense table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f2f0f0'}}>
                <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Total Orders</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Net Sales ($)</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Profit (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                salesLastSevenDays.map((item, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#faf0e8' : '#f2f0f0'}}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.total_orders}</TableCell>
                    <TableCell>{item.net_sales}</TableCell>
                    <TableCell>{item.profit_percentage}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </TableGrid1> */}

      <TableGrid2>
        <TableHeader>
          <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#121B28'>
            Top Categories - This Month
          </Typography>
          {/* <Typography variant="body2" fontSize='12px' fontFamily='inherit' fontWeight='600' marginTop='2px' marginLeft='3px'>
            - Sales Wise (This Month)
          </Typography> */}
        </TableHeader>
        <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />
        <TableContainer>
          <Table size='small' aria-label="a dense table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f2f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Value ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                topCategoriesSalesMonth.map((item, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f0f0' }}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.value}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </TableGrid2>

      <TableGrid2>
        <TableHeader>
          <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#121B28'>
            Top Categories - Today
          </Typography>
        </TableHeader>
        <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />
        <TableContainer>
          <Table size='small' aria-label="a dense table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f2f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Value ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                topCategoriesSalesToday.map((item, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f0f0' }}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.value}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </TableGrid2>

      <TableGrid2>
        <TableHeader>
          <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#121B28'>
            Top Item - This Month
          </Typography>
        </TableHeader>
        <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />
        <TableContainer>
          <Table size='small' aria-label="a dense table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f2f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Value ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                topItemsSalesMonth.map((item, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f0f0' }}>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>${item.value}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </TableGrid2>

      <TableGrid2>
        <TableHeader>
          <Typography variant="h7" fontFamily='inherit' fontWeight='600' color='#121B28'>
            Top Item - Today
          </Typography>
        </TableHeader>
        <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />
        <TableContainer>
          <Table size='small' aria-label="a dense table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f2f0f0' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Value ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                topItemsSalesToday.map((item, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f0f0' }}>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>${item.value}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </TableGrid2>

      <Divider style={{ marginTop: '8px', marginBotton: '0px', flex: 1, width: '100%' }} />

    </DashboardGrid>
  )
}

export default Dashboard