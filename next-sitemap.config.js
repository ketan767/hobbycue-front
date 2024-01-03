module.exports = {
  siteUrl: 'http://localhost:3000',
  generateRobotsTxt: true,
  async generateSitemap({ getAllUserDetail }) {
    try {
      console.log('generateSitemap function is executing...')
      const { res, err } = await getAllUserDetail('')

      console.log('Response:', res)
      console.log('Error:', err)

      if (err || !res?.data?.users) {
        console.error('Error fetching user details:', err)
        return {
          urls: [],
        }
      }

      const userUrls = res.data.users.reduce((accumulator, user) => {
        if (user.profile_url) {
          return [...accumulator, { loc: user.profile_url }]
        }
        return accumulator
      }, [])

      console.log('Generated URLs:', userUrls)

      return {
        urls: userUrls,
      }
    } catch (error) {
      console.error('Error generating sitemap:', error)
      return {
        urls: [],
      }
    }
  },
}
