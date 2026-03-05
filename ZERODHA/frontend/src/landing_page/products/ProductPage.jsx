import React from "react";
import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

const ProductPage = () => {
  const products = [
    {
      type: "left",
      imageURL: "media/images/kite.png",
      productName: "Kite",
      productDescription:
        "Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.",
      tryDemo: "Try Demo",
      learnMore: "Learn More",
      googlePlay: "media/images/googlePlayBadge.svg",
      appStore: "media/images/appstoreBadge.svg",
      learnMoreLink: "/products/kite",
      demoLink: "/demo/kite",
    },
    {
      type: "right",
      imageURL: "media/images/console.png",
      productName: "Console",
      productDescription:
        "The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations.",
      learnMore: "Learn More",
      learnMoreLink: "/products/console",
    },
    {
      type: "left",
      imageURL: "media/images/coin.png",
      productName: "Coin",
      productDescription:
        "Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices.",
      tryDemo: "Try Coin",
      learnMore: "Learn More",
      googlePlay: "media/images/googlePlayBadge.svg",
      appStore: "media/images/appstoreBadge.svg",
      learnMoreLink: "/products/coin",
      demoLink: "/demo/coin",
    },
    {
      type: "right",
      imageURL: "media/images/kiteconnect.png",
      productName: "Kite Connect API",
      productDescription:
        "Build powerful trading platforms and experiences with our simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our clientbase.",
      learnMore: "Learn More",
      learnMoreLink: "/products/kite-connect",
    },
    {
      type: "left",
      imageURL: "media/images/varsity.png",
      productName: "Varsity mobile",
      productDescription:
        "An easy to grasp collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go.",
      googlePlay: "media/images/googlePlayBadge.svg",
      appStore: "media/images/appstoreBadge.svg",
      learnMoreLink: "/products/varsity",
    },
  ];

  const openTechBlog = () => {
    window.open("https://zerodha.tech", "_blank");
  };

  return (
    <div>
      <Hero />

      {products.map((p, idx) => {
        const commonProps = {
          imageURL: p.imageURL,
          productName: p.productName,
          productDescription: p.productDescription,
          tryDemo: p.tryDemo,
          learnMore: p.learnMore,
          googlePlay: p.googlePlay,
          appStore: p.appStore,
        };

        // ✅ Optional: pass links as extra props (agar tum components me handle karna chaho)
        // commonProps.learnMoreLink = p.learnMoreLink;
        // commonProps.demoLink = p.demoLink;

        return p.type === "left" ? (
          <LeftSection key={idx} {...commonProps} />
        ) : (
          <RightSection key={idx} {...commonProps} />
        );
      })}

      <div className="container">
        <p className="text-center mt-4 text-muted">
          Want to know more about our technology stack? Check out the{" "}
          <span
            className="text-primary hover-text cursor-pointer fw-semibold"
            onClick={openTechBlog}
            role="button"
            tabIndex={0}
          >
            Zerodha.tech
          </span>{" "}
          blog.
        </p>
      </div>

      <Universe />
    </div>
  );
};

export default ProductPage;