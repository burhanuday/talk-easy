import { useEffect } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { firebaseInit, signInAnonymously } from "utils/firebase";

function App({ Component, pageProps }) {
  useEffect(() => {
    firebaseInit();
    signInAnonymously();
    return () => {};
  }, []);

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default App;
