/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_LOCALURL,
    },
  };
  
  export default nextConfig;
  