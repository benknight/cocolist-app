require('dotenv').config();

module.exports = {
  siteMetadata: {
    author: 'Benjamin Knight',
    description: 'Find eco-conscious businesses in Saigon',
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
        queries: require('./src/lib/algolia-queries'),
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
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Businesses',
            tableView: process.env.DEV_DATA === 'true' ? 'Dev' : 'Published',
            tableLinks: ['F&B_survey', 'Neighborhood', 'Category'],
            defaultValues: {
              Category: [],
              Neighborhood: [],
            },
            mapping: {
              Business_photos: 'fileNode',
              Profile_photo: 'fileNode',
            },
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Cities',
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Neighborhoods',
            tableLinks: ['City'],
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Categories',
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Food & Beverage Survey',
            tableLinks: ['Business_record_match'],
            defaultValues: {
              Food_waste_programs: [],
              Menu: [],
              Kitchen_waste_management: [],
            },
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Translations',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-i18n',
      options: {
        langKeyDefault: 'en',
        prefixDefault: false,
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
