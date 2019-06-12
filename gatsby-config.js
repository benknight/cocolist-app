require('dotenv').config();

module.exports = {
  siteMetadata: {
    author: 'Benjamin Knight',
    description: 'Find eco-conscious businesses in Saigon',
    title: 'Cocolist',
    siteUrl: 'https://cocolist.app',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
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
        policy: [{ userAgent: '*', disallow: '/' }],
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
            tableView: 'Published',
            tableLinks: ['F&B_Survey', 'Neighborhood', 'Category'],
            defaultValues: {
              Neighborhood: [],
              Category: [],
            },
            mapping: { Photos: 'fileNode' },
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Neighborhoods',
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Categories',
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Food & Beverage Survey',
            tableLinks: ['Business_Record_Match'],
            defaultValues: {
              Food_waste_programs: [],
              Menu: [],
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
};
