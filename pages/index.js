import Head from 'next/head';
import Header from 'components/Header';
import { MainContainer } from 'components/Containers';

const links = [
  {
    name: 'JSON',
    href: '/widgets/RE2R/json',
    active: false
  },
  {
    name: 'Websocket',
    href: '/widgets/RE2R/ws',
    active: false
  },
  {
    name: 'Inventory',
    href: '/widgets/RE2R/inventory',
    active: false
  },
  {
    name: 'JSON',
    href: '/widgets/RE3R/json',
    active: false
  },
  {
    name: 'Websocket',
    href: '/widgets/RE3R/ws',
    active: false
  },
  {
    name: 'Inventory',
    href: '/widgets/RE3R/inventory',
    active: false
  },
  {
    name: 'JSON',
    href: '/widgets/RE4R/json',
    active: false
  },
  {
    name: 'Websocket',
    href: '/widgets/RE4R/ws',
    active: false
  },
  {
    name: 'Inventory',
    href: '/widgets/RE4R/inventory',
    active: false
  },
  {
    name: 'JSON',
    href: '/widgets/Alice/json',
    active: false
  }
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | SRT</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute w-full h-full bg-gray-100 overflow-hidden">
        <MainContainer>
          <Header links={links} />
          <div className="w-full h-full flex flex-col justify-center items-center text-gray-200">
            <div className="w-full h-full bg-main brightness-50 bg-cover bg-center" />
            <div className="absolute w-full h-full flex flex-col justify-center items-center p-8 py-16 gap-2">
              <div className="w-full h-40 bg-title bg-contain bg-center bg-no-repeat" />
              <h1 className="text-white text-xl font-bold">Welcome to SRT Web Tool Kit</h1>
              <h1 className="text-white text-lg">Created By: VideoGameRoulette</h1>
            </div>
          </div>
        </MainContainer>
      </div>
    </>
  )
}
