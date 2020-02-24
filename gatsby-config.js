require('dotenv').config();

module.exports = {
  siteMetadata: {
    author: 'Benjamin Knight',
    description: 'Find eco-conscious businesses in Vietnam',
    title: 'Cocolist',
    siteUrl: 'https://cocolist.app',
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
            ? require('./src/lib/common/AlgoliaQueries').queries
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
            baseId: process.env.AIRTABLE_BASE_APP,
            tableName: 'Categories',
          },
          {
            baseId: process.env.AIRTABLE_BASE_APP,
            tableName: 'Cities',
            tableLinks: ['Partners'],
            mapping: {
              Cover: 'fileNode',
            },
          },
          {
            baseId: process.env.AIRTABLE_BASE_APP,
            tableName: 'Locations',
            tableLinks: ['Survey', 'City', 'Neighborhood'],
          },
          {
            baseId: process.env.AIRTABLE_BASE_APP,
            tableName: 'Neighborhoods',
            tableLinks: ['City'],
          },
          {
            baseId: process.env.AIRTABLE_BASE_APP,
            tableName: 'Survey',
            tableLinks: ['Neighborhood', 'Category', 'Locations'],
            mapping: {
              Attachments: 'fileNode',
              Cover_photo: 'fileNode',
              Profile_photo: 'fileNode',
            },
          },
          {
            baseId: process.env.AIRTABLE_BASE_APP,
            tableName: 'Partners',
            mapping: {
              Logo: 'fileNode',
            },
          },
          {
            baseId: process.env.AIRTABLE_BASE_TRANSLATIONS,
            tableName: 'Messages',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-prefetch-google-fonts',
      options: {
        fonts: [
          {
            family: 'Montserrat',
            subsets: ['vietnamese'],
            variants: ['400', '500', '700'],
          },
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
};
