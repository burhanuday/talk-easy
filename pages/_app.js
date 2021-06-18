import { ChakraProvider } from "@chakra-ui/react";
import { firebaseInit, signInAnonymously } from "utils/firebase";

firebaseInit();
signInAnonymously();

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default App;
