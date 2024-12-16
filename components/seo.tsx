import { NextSeo } from "next-seo";

const SEO: React.FC = () => {
  return (
    <NextSeo
      title="Circle"
      description="Place where Artists, Philosophers and Engineers can meet together to form a better world"
      canonical="https://publicsquare.vercel.app"
      openGraph={{
        url: "https://publicsquare.vercel.app",
        title: "Circle",
        description:
          "Place where Artists, Philosophers and Engineers can meet together to form a better world",
        images: [
          {
            url: "/img/seo.webp",
            width: 1920,
            height: 1080,
            alt: "Circle's Website",
          },
        ],
        site_name: "Circle",
      }}
      twitter={{
        handle: "@akshatwts",
        site: "@akshatwts",
        cardType: "summary_large_image",
      }}
    />
  );
};

export default SEO;
