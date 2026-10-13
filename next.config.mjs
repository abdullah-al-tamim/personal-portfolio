/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/CV_Abdullah_al_Tamim.pdf",
        destination: "/cv/Abdullah_Al_Tamim_Data_Automations_Analyst.pdf",
        permanent: true,
      },
      {
        source: "/02_Abdullah_al_Tamim-JP.pdf",
        destination: "/cv/Abdullah_Al_Tamim_Academic_CV.pdf",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
