import dynamic from 'next/dynamic'

const HomePage = dynamic(() => import('./home'), { ssr: false })

export function HomePageNoSSR() {
  return <HomePage />
}
