import "../styles/globals.css";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../src/aws-exports";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import type { AppProps } from "next/app";
import Layout from "components/Layout";

Amplify.configure({ ...awsExports, ssr: true });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Authenticator>
  );
}
export default MyApp;
