module.exports = {
  client: {
    service: {
      url: `YOUR_APOLLO_ENDPOINT`,
      headers: {
        'X-Hasura-Admin-Secret': 'YOUR_ADMIN_SECRET',
      },
    },
  },
}
