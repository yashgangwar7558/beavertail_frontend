import React from 'react'
import StatBox from '../../components/StatBox'
import { StatBoxData } from '../../utils/StatBoxData'
import { LineChartHeaderData } from '../../utils/ChartData'
import { TopRecipesCarouselData, TopTypesCarouselData, TopPurchasedIngredientsCarouselData, TopVendorsCarouselData } from '../../utils/CarouselData'
import LineChart from '../../components/LineChart'
import BarChart from '../../components/BarChart'
import ImageCarousel from '../../components/ImageCarousel'
import useWindowDimensions from '../../utils/windowDimensions'
import { Box, Typography } from '@mui/material'
import { PaidRounded, PointOfSaleRounded } from '@mui/icons-material'
import styled from 'styled-components'

const DashboardGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-template-rows: 1fr 2fr 2fr;
	grid-auto-rows: auto;
	height: calc(100vh - 72px);
	gap: 10px;
	margin: 0px 15px;

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
	grid-column: span 12;
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
const BarChartGrid = styled(Box)`
	grid-column: span 12;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	border-radius: 20px;

	@media screen and (max-width: 1024px) {
		grid-column: span 12;
    }
`

const Dashboard = (props) => {

  const { width, height } = useWindowDimensions()
  const statBoxData = StatBoxData()
  const lineChartHeaderData = LineChartHeaderData()
  const topRecipesCarouselData = TopRecipesCarouselData()
  const topTypesCarouselData = TopTypesCarouselData()
  const topPurchasedIngredientsCarouselData = TopPurchasedIngredientsCarouselData()
  const topVendorsCarouselData = TopVendorsCarouselData()

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
          {
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
          }
          <Box>
            <PaidRounded sx={{ color: '#047c44', fontSize: '36px' }} />
          </Box>
        </ChartHeader>
        <Box height="225px" ml="-20px" mt="-35px">
          <LineChart winWidth={width} />
        </Box>
      </LineChartGrid>


      <ImageCarousel title='Top Items with Highest Margin' data={topRecipesCarouselData.topMargin} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Items with Highest Sell' data={topRecipesCarouselData.topSales} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Categories with Highest Margin' data={topTypesCarouselData.topMargin} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Categories with Highest Sell' data={topTypesCarouselData.topSales} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Ingredients Bought this week' data={topPurchasedIngredientsCarouselData.topIngredients} renderCarousel={props.renderCarousel} winWidth={width} />
      <ImageCarousel title='Top Vendors' data={topVendorsCarouselData.topVendors} renderCarousel={props.renderCarousel} winWidth={width} />

      <BarChartGrid>
        <ChartHeader>
          <Box>
            <Typography variant="h6" fontFamily='inherit' fontWeight='600' color='#121B28'>
              {lineChartHeaderData[2].title}
            </Typography>
            <Typography variant="h5" fontFamily='inherit' fontWeight='500' color='#047c44'>
              {lineChartHeaderData[2].subtitle}
            </Typography>
          </Box>
          <Box>
            <PaidRounded sx={{ color: '#047c44', fontSize: '36px' }} />
          </Box>
        </ChartHeader>
        <Box height="225px" ml="-20px" mt="-35px">
          <BarChart winWidth={width} />
        </Box>
      </BarChartGrid>

    </DashboardGrid>
  )
}

export default Dashboard