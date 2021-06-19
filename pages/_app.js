import { useEffect } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { firebaseInit, signInAnonymously } from "utils/firebase";
import { getUserLanguage, setUserLanguage } from "utils/language";

function App({ Component, pageProps }) {
  const setDefaultLanguage = () => {
    const langauge = getUserLanguage();
    if (!langauge) {
      setUserLanguage("en-IN");
    }
  };

  useEffect(() => {
    setDefaultLanguage();
    firebaseInit();
    signInAnonymously();
  }, []);

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default App;
