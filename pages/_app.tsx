import "../styles/globals.css";
import awsExports from "../src/aws-exports";

Amplify.configure({...awsExports, ssr: true });
import type { AppProps } from "next/app";
import Layout from "components/Layout";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
}
export default MyApp;
