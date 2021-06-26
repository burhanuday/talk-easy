# TalkEasy

> Development env will not work as we have deleted the Firebase project and Cloud translation projects. However, the deployed demo will still work at [https://talk-easy.vercel.app](https://talk-easy.vercel.app)

> To run it locally, follow the instructions in the *Development* section

### Watch the demo

[![TalkEasy Demo](https://img.youtube.com/vi/AiFNjv_QTgI/0.jpg)](https://www.youtube.com/watch?v=AiFNjv_QTgI)


### Try it yourself
[https://talk-easy.vercel.app](https://talk-easy.vercel.app)

### Why?
People face language barriers when it comes to the conference meetings around the globe. TalkEasy allows them to communicate in their own languages.

Currently in the market, there are a few apps like Zoom and Skype that do allow translation. Zoom allows translation in the mode of a physical translator joining the users meeting. Skype shows translated subtitles in the language the user prefers but only for 11 langauges but it does not support speech synthesis on the receiver's end.

TalkEasy provides the following features -
- 70 languages with different accents including Indian languages
- Realtime subtitles just like you are watching a movie
- Users can speak in multi-languages in a call which gets translated too.
- After the speaker completes a sentence, the receiver receives the translated audio in the selected language.
- Once the meeting has ended, the user receives an option to download the entire meeting’s transcript in one of the languages that the meeting was in

## Development

You will need the following env variables in a file called `.env.local`

- We use Agora for WebRTC
- Firebase for Firestore, Auth, and Realtime Database

```
NEXT_PUBLIC_AGORA_APPID
NEXT_PUBLIC_AGORA_APPC

NEXT_AGORA_CUSTOMER_ID
NEXT_AGORA_CUSTOMER_SECRET

NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIERBASE_AUTH_DOMAIN
NEXT_PUBLIC_PROJECT_ID
NEXT_PUBLIC_STORAGE_BUCKET
NEXT_PUBLIC_MESSAGING_ID
NEXT_PUBLIC_APP_ID
NEXT_PUBLIC_FIREBASE_DB
NEXT_PUBLIC_CLIENT_LOCATION=http://localhost:3000
```

Add the `firebase-admin` service account config in the root directory in a file called `firebaseServiceAccount.json`

For realtime subtitles to work, you will need to create a service account on Google Cloud which has access to Cloud Translation API. Create a file called `service-account-key.json` in the root directory

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.

## License

MIT
