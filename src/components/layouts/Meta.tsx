import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
};

const Meta = ({
  title = "Siddharth-electrical",
  description = "A complete electrical & Household store",
  image = "https://res.cloudinary.com/dgmz3svbn/image/upload/v1724528288/logo-color_lsjdik.png",
  keywords = "Electrical Wire Bulb Household Electronic dehradun wholesale best prices",
}: MetaProps) => {
  return (
    <Head>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
