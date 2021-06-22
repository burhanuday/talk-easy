import { useEffect } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { firebaseInit } from "utils/firebase";
import { getUserLanguage, setUserLanguage } from "services/storage";
import { signInAnonymously } from "services/auth";

firebaseInit();

function App({ Component, pageProps }) {
  const setDefaultLanguage = () => {
    const langauge = getUserLanguage();
    if (!langauge) {
      setUserLanguage("en-IN");
    }
  };

  useEffect(() => {
    setDefaultLanguage();
    signInAnonymously();
  }, []);

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default App;
