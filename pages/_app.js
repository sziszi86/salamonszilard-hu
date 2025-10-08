import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PreLoader from "../src/layouts/PreLoader";
import { LanguageProvider } from "../src/contexts/LanguageContext";
import ClientOnly from "../src/components/ClientOnly";
import "../styles/globals.css";
import "../styles/mobile-header.css";
const App = ({ Component, pageProps }) => {
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 500);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Salamon Szilárd - Frontend Webfejlesztő</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="author" content="Salamon Szilárd" />
        <meta name="description" content="Frontend webfejlesztő - HTML5, CSS3, React, Next.js, Angular, JavaScript fejlesztés" />
        {/* Favicon */}
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <ClientOnly>
        <LanguageProvider>
          {loader && <PreLoader />}
          <Component {...pageProps} />
        </LanguageProvider>
      </ClientOnly>
    </Fragment>
  );
};
export default App;
