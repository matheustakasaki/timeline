import ReactDOM from 'react-dom/client'
import timelineItems from './timelineItems.js'
import Main from './main.js'
import './index.css'

function App() {
  return (
      <main className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Timeline Component</h1>
        <Main items={timelineItems} />
      </main>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
