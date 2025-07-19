/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },{
        protocol: 'https',
        hostname:"res.cloudinary.com",
        port:""
      }
    ]
  },
  transpilePackages: ['geist'],
  typescript:{
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;
