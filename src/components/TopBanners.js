import { TopBanner } from "@site/src/components/Sponsors/TopBanner";

export const TopBanners = () => {
  return (
    <TopBanner
      items={[
        {
          imgSrc: "/ads/pipelines-banner.png",
          mobileImgSrc: "/ads/pipelines-banner-mobile.png",
          url: "https://github.com/open-webui/pipelines",
          name: "Open WebUI Pipelines",
          description:
            "Pipelines: Versatile, UI-Agnostic OpenAI-Compatible Plugin Framework",
        },
        {
          imgSrc: "/ads/placeholder.png",
          mobileImgSrc: "/ads/placeholder-mobile.png",
          url: "https://github.com/sponsors/tjbck",
          name: "Open WebUI",
          description:
            "The top banner spot is reserved for only two Enterprise Diamond sponsors on a first-come, first-served basis",
        },
      ]}
    />
  );
};
