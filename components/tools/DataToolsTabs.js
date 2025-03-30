import { useState } from 'react'
import CombinedDataTools from './CombinedDataTools'

const DataToolsTabs = () => {
  const [activeTab, setActiveTab] = useState('converter')

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex border-b border-neutral-700 mb-4">
        <button
          className={`px-4 py-2 font-medium transition-colors duration-200 ${activeTab === 'converter' ? 'border-b-2 border-blue-500 text-white' : 'text-neutral-400 hover:text-white'}`}
          onClick={() => setActiveTab('converter')}
        >
          Einheitenumrechner
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors duration-200 ${activeTab === 'download' ? 'border-b-2 border-blue-500 text-white' : 'text-neutral-400 hover:text-white'}`}
          onClick={() => setActiveTab('download')}
        >
          Downloadzeit
        </button>
      </div>

      <div>
        {activeTab === 'converter' && <CombinedDataTools mode="converter" />}
        {activeTab === 'download' && <CombinedDataTools mode="download" />}

      </div>
    </div>
  )
}

export default DataToolsTabs
