import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import * as XLSX from 'xlsx';

const BrandPerformanceDashboard = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="alert alert-info">Upload a brand performance file to see the dashboard.</div>;
  }

  const processedData = data.map(item => {
    let dateValue = item.Date;
    // Check if the date is an Excel serial number
    if (typeof dateValue === 'number') {
      dateValue = XLSX.SSF.parse_date_code(dateValue);
    }
    return {
      ...item,
      Date: new Date(dateValue).toISOString().slice(0, 10), // Format date for display as YYYY-MM-DD
      'Sales Rank': parseFloat(item['Sales Rank']),
      'Featured Offer (Buy Box) Percentage': parseFloat(item['Featured Offer (Buy Box) Percentage']),
      'Featured Offer (Buy Box) Percentage - B2B': parseFloat(item['Featured Offer (Buy Box) Percentage - B2B']),
      'Average Customer Review': parseFloat(item['Average Customer Review']),
      'Number of Customer Reviews': parseFloat(item['Number of Customer Reviews'])
    };
  });

  // Aggregate data by ASIN for average Sales Rank and Featured Offer Percentage
  const aggregatedByASIN = processedData.reduce((acc, item) => {
    const asin = item['ASIN'];
    if (asin) {
      if (!acc[asin]) {
        acc[asin] = { totalSalesRank: 0, totalFeaturedOffer: 0, totalAvgReview: 0, totalNumReviews: 0, count: 0 };
      }
      acc[asin].totalSalesRank += item['Sales Rank'] || 0;
      acc[asin].totalFeaturedOffer += item['Featured Offer (Buy Box) Percentage'] || 0;
      acc[asin].totalAvgReview += item['Average Customer Review'] || 0;
      acc[asin].totalNumReviews += item['Number of Customer Reviews'] || 0;
      acc[asin].count += 1;
    }
    return acc;
  }, {});

  const asinSalesRankData = Object.keys(aggregatedByASIN).map(asin => ({
    asin: asin,
    averageSalesRank: aggregatedByASIN[asin].totalSalesRank / aggregatedByASIN[asin].count
  })).sort((a, b) => a.averageSalesRank - b.averageSalesRank).slice(0, 10); // Top 10 (lowest rank is best)

  const asinFeaturedOfferData = Object.keys(aggregatedByASIN).map(asin => ({
    asin: asin,
    averageFeaturedOffer: aggregatedByASIN[asin].totalFeaturedOffer / aggregatedByASIN[asin].count
  })).sort((a, b) => b.averageFeaturedOffer - a.averageFeaturedOffer).slice(0, 10); // Top 10 (highest percentage is best)

  // Data for Average Customer Review Distribution
  const reviewDistribution = processedData.reduce((acc, item) => {
    const review = Math.floor(item['Average Customer Review'] * 2) / 2; // Bin by 0.5
    if (!isNaN(review)) {
      acc[review] = (acc[review] || 0) + 1;
    }
    return acc;
  }, {});

  const reviewDistributionData = Object.keys(reviewDistribution).map(key => ({
    range: parseFloat(key).toFixed(1),
    count: reviewDistribution[key]
  })).sort((a, b) => parseFloat(a.range) - parseFloat(b.range));

  // Data for Number of Customer Reviews Distribution
  const numReviewsDistribution = processedData.reduce((acc, item) => {
    const numReviews = item['Number of Customer Reviews'];
    let range;
    if (numReviews === 0) range = '0';
    else if (numReviews > 0 && numReviews <= 10) range = '1-10';
    else if (numReviews > 10 && numReviews <= 50) range = '11-50';
    else if (numReviews > 50 && numReviews <= 100) range = '51-100';
    else range = '>100';

    if (range) {
      acc[range] = (acc[range] || 0) + 1;
    }
    return acc;
  }, {});

  const numReviewsDistributionData = Object.keys(numReviewsDistribution).map(key => ({
    range: key,
    count: numReviewsDistribution[key]
  })).sort((a, b) => {
    const order = {'0': 0, '1-10': 1, '11-50': 2, '51-100': 3, '>100': 4};
    return order[a.range] - order[b.range];
  });

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Brand Performance Dashboard</h5>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={processedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Sales Rank" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Featured Offer (Buy Box) Percentage" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Featured Offer (Buy Box) Percentage - B2B" stroke="#ffc658" />
            <Line type="monotone" dataKey="Average Customer Review" stroke="#ff7300" />
            <Line type="monotone" dataKey="Number of Customer Reviews" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>

        <h5 className="card-title mt-4">Top 10 ASINs by Average Sales Rank</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={asinSalesRankData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="asin" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageSalesRank" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <h5 className="card-title mt-4">Top 10 ASINs by Average Featured Offer (Buy Box) Percentage</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={asinFeaturedOfferData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="asin" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageFeaturedOffer" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <h5 className="card-title mt-4">Distribution of Average Customer Review</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={reviewDistributionData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>

        <h5 className="card-title mt-4">Distribution of Number of Customer Reviews</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={numReviewsDistributionData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BrandPerformanceDashboard;