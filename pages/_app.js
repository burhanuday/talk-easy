import firebase from "firebase/app";
import { ChakraProvider } from "@chakra-ui/react";
import { firebaseConfig } from "constants/firebase";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default App;
