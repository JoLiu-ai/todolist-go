import React, { useState } from 'react'
import MediaPage from './pages/MediaPage'
import Sidebar from './components/Sidebar'
import { MediaType } from './types/media'

const App: React.FC = () => {
  const [mediaType, setMediaType] = useState<MediaType>('book')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Cute Todo Media Library
          </h1>
        </div>
      </header>
      <div className="flex">
        <Sidebar mediaType={mediaType} onChangeMediaType={setMediaType} />
        <main className="flex-1">
          <MediaPage mediaType={mediaType} />
        </main>
      </div>
    </div>
  )
}

export default App 