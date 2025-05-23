import type { AppProps } from "next/app";
import { globalStyles } from "@/stitches.config";
import { useEffect } from "react";
import "micro-observables/batchingForReactDom";
import { SWRConfig } from "swr";
import { apolloClient } from "@/apollo/client";
import { ApolloProvider, gql } from "@apollo/client";
import PageContainer from "@/layouts/PageContainer";
import { ToastContainer } from "@/components/ToastContainer";
import { Provider, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import SEO from "@/components/seo";
// import WalletConnect from "@walletconnect/web3-provider";
// import { sequence } from "0xsequence";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
// import { SequenceConnect } from "@/utils/sequenceConnect";

// const store = createStore();

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();

  // const [sequenceProvider, setSequenceProvider] = useState({
  //   walletconnect: {
  //     package: WalletConnect,
  //     options: {
  //       infuraId: "c352645ba30f49f4b714a51948a1c4b7",
  //     },
  //   },
  // });

  const connectors = [
    new InjectedConnector({ chains: defaultChains }),
    // new SequenceConnect({ chains: defaultChains }),
  ];

  useEffect(() => {
    console.log("Thank you for coming here! @akshatwts");

    if (typeof window === 'undefined') return;

    // Suppress browser extension errors
    const handleError = (e: ErrorEvent) => {
      if (e.message?.includes('chrome.runtime.sendMessage') || 
          e.message?.includes('Extension ID') ||
          e.filename?.includes('chrome-extension://') ||
          e.error?.stack?.includes('chrome-extension://')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (e.reason?.message?.includes('chrome.runtime.sendMessage') ||
          e.reason?.message?.includes('Extension ID')) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    // Also suppress console errors from extensions
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('chrome.runtime.sendMessage') || 
          message.includes('Extension ID')) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // if (window && !window?.ethereum?.isSequence) {
    //   setSequenceProvider({
    //     ...sequenceProvider,
    //     sequence: {
    //       package: sequence,
    //       options: {
    //         appName: "Public Square",
    //         defaultNetwork: "mumbai",
    //       },
    //     },
    //   });
    // }

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <Provider autoConnect connectors={connectors}>
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (query, variables) =>
            apolloClient.query({
              query: gql(query),
              variables,
            }),
        }}>
        <ApolloProvider client={apolloClient}>
          <PageContainer>
            <SEO />
            <Component {...pageProps} />
            <ToastContainer />
          </PageContainer>
        </ApolloProvider>
      </SWRConfig>
    </Provider>
  );
}

export default MyApp;

/* </StoreProvider> */
