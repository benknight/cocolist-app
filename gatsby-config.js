module.exports = {
  siteMetadata: {
    author: 'Benjamin Knight',
    description: 'Find eco-conscious businesses in Saigon',
    title: 'Cocolist',
    siteUrl: 'https://cocolist.app',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
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
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [require(`postcss-preset-env`)({ stage: 0 })],
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/lib/typography',
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
            tableView: process.env.NODE_ENV === 'development' ? 'Dev' : undefined,
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
          },
          {
            baseId: 'appYMPFmCnV9M4Szq',
            tableName: 'Strings',
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
