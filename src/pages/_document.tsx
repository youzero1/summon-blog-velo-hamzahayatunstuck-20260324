import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A modern blog application built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
        <title>Next.js Blog</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}