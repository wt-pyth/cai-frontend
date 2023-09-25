// next.config.js
const withLess = require('next-with-less');

const moduleExports = {
  lessLoaderOptions: {
    /* ... */
    lessOptions: {
    }
  }
};

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/question",
        destination: "https://func-chat-backend-si-genai-dev-sea-01.azurewebsites.net/app/get",
      },
    ];
  },
};
module.exports = nextConfig;




// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withLess(moduleExports);
