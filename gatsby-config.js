require('dotenv').config();

const baseId = 'appYMPFmCnV9M4Szq';

module.exports = {
  siteMetadata: {
    author: 'Benjamin Knight',
    description: 'Find eco-conscious businesses in Vietnam',
    title: 'Cocolist',
    siteUrl: 'https://cocolist.vn',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries:
          process.env.BUILD_ALGOLIA === 'true'
            ? require('./src/lib/AlgoliaQueries.common').queries
            : [],
        // chunkSize: 10000, // default: 1000
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'cocolist',
        short_name: 'cocolist',
        start_url: '/',
        background_color: '#4bbf6b',
        theme_color: '#4bbf6b',
        display: 'minimal-ui',
        icon: 'src/assets/icon.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/assets`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/' }],
        sitemap: null,
      },
    },
    {
      resolve: 'gatsby-source-airtable',
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          // in alphabetical order:
          {
            baseId,
            tableName: 'Businesses',
            tableView:
              process.env.NODE_ENV === 'development' || process.env.DEV === 'true'
                ? 'Dev'
                : 'Businesses',
            tableLinks: ['Survey', 'Neighborhood', 'Category', 'Locations'],
            defaultValues: {
              // TODO: don't rely on this
              Category: [],
              Neighborhood: [],
              Locations: [],
            },
            mapping: {
              Profile_photo: 'fileNode',
            },
          },
          {
            baseId,
            tableName: 'Categories',
          },
          {
            baseId,
            tableName: 'Cities',
            mapping: {
              Cover: 'fileNode',
            },
          },
          {
            baseId,
            tableName: 'Locations',
            tableLinks: ['Business', 'City', 'Neighborhood'],
          },
          {
            baseId,
            tableName: 'Neighborhoods',
            tableLinks: ['City'],
          },
          {
            baseId,
            tableName: 'Survey',
            tableLinks: ['Business_record_match'],
            defaultValues: {
              Food_waste_programs: [],
              Menu: [],
              Kitchen_waste_management: [],
            },
            mapping: {
              Attachments: 'fileNode',
            },
          },
          {
            baseId,
            tableName: 'Translations',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-132919803-1',
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        // anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        // exclude: ['/preview/**', '/do-not-track/me/too/'],
        // Enables Google Optimize using your container Id
        // optimizeId: 'YOUR_GOOGLE_OPTIMIZE_TRACKING_ID',
        // Enables Google Optimize Experiment ID
        // experimentId: 'YOUR_GOOGLE_EXPERIMENT_ID',
        // Set Variation ID. 0 for original 1,2,3....
        // variationId: 'YOUR_GOOGLE_OPTIMIZE_VARIATION_ID',
        // Any additional create only fields (optional)
        // sampleRate: 5,
        // siteSpeedSampleRate: 10,
        // cookieDomain: 'example.com',
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
};
