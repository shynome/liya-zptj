import { HomeState } from './home.state'

export default function HomePage() {
  return (
    <HomeState.Provider>
      <Home />
    </HomeState.Provider>
  )
}

import { Upload } from './Upload'
import { Download } from './Download'

const Home = () => {
  const { state } = HomeState.useContainer()
  return (
    <>
      <hr />
      <Upload />
      <hr />
      <Download />
    </>
  )
}
