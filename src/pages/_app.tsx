import {ChallengesProvider} from '../contextts/ChallengesContext';

import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <ChallengesProvider>
        <Component {...pageProps} />
    </ChallengesProvider>
  );
}

export default MyApp
