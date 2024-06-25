import { useState } from 'react'
import FormAgregarConexion from '../components/FormAgregarConexion'
import { BASE_URL } from '../constants'
// {
//   "conexiones": [
//     ["A", "B", 10],
//     ["B", "C", 15],
//     ["A", "C", 20],
//     ["C", "D", 12],
//     ["D", "E", 15],
//     ["E", "F", 10],
//     ["D", "F", 15]
//     ],
//   "start": "A",
//   "end": "F"
// }

type Conexion = [string, string, number]

export default function Dijkstra() {
  // [['A', 'B', 1], ['A', 'C', 4], ['B', 'C', 2], ['B', 'D', 5], ['C', 'D', 1]]
  const [conexiones, setConexiones] = useState<Conexion[]>([])
  const [agregando, setAgregando] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nodoInicial, setNodoInicial] = useState('')
  const [nodoFinal, setNodoFinal] = useState('')

  const [pngUrl, setPngUrl] = useState('')

  const handleAgregarConexion = () => {
    setAgregando(true)
  }

  const handleDownload = () => {
    if (!pngUrl) return

    // Create a link element and trigger the download
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = 'mst.png' // Set the default filename here
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleCalcular = async () => {
    if (!nodoInicial || !nodoFinal) return
    setIsModalOpen(true)
    const response = await fetch(BASE_URL + '/dijkstra', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
      },
      body: JSON.stringify({ conexiones, start: nodoInicial, end: nodoFinal }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const image = await response.blob()
    if (image) {
      const imageUrl = URL.createObjectURL(image)
      setPngUrl(imageUrl)
    }
  }

  return (
    <div className="flex flex-col items-center flex-1">
      <h1 className="text-4xl mb-2 font-bold text-blue-800 dark:text-cyan-200">
        DIJKSTRA
      </h1>
      <span className="text-lg underline font-bold">Conexiones:</span>
      <ul className="flex flex-col gap-2 py-2">
        {conexiones.length > 0 &&
          conexiones.map(conexion => (
            <li key={`${conexion[0]}-${conexion[1]}-${conexion[2]}`}>
              <span className="text-lg">
                {conexion[0]} - {conexion[1]} {'->'} Peso: {conexion[2]}
                <button
                  onClick={() =>
                    setConexiones(prevConexiones =>
                      prevConexiones.filter(
                        (c: Conexion) =>
                          !(c[0] === conexion[0] && c[1] === conexion[1])
                      )
                    )
                  }
                  type="button"
                  className="hover:bg-red-800 active:bg-red-900 bg-red-600 rounded-sm text-white font-bold px-1 ml-3">
                  x
                </button>
              </span>
            </li>
          ))}
      </ul>
      {agregando && (
        <FormAgregarConexion
          className="flex flex-col p-2 gap-2 items-end"
          setAgregando={setAgregando}
          setConexiones={setConexiones}
        />
      )}
      {!agregando && (
        <button
          onClick={handleAgregarConexion}
          className="p-2 text-xl font-bold hover:bg-blue-800 active:bg-blue-900 bg-blue-600"
          type="button">
          <span>Nueva</span>
        </button>
      )}
      {isModalOpen && (
        <div className="bg-zinc-800 opacity-95 z-10 absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
          <div className="relative flex flex-col gap-5 justify-center items-center h-full w-full">
            <div className="relative">
              <img src={pngUrl} className="w-full" />
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="absolute top-0 right-0 bg-red-500 border-red-500 p-2 inline-flex items-center justify-center text-zinc-50 hover:bg-red-700 active:bg-red-900">
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="bg-cyan-500 hover:bg-zinc-800 hover:text-cyan-500 border-cyan-500 border-2 text-zinc-950 font-bold py-2 px-4 rounded inline-flex items-center">
              <svg
                className="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      )}
      <label htmlFor="nodo-inicial">
        Nodo inicial:
        <input
          className="outline-none w-10 text-zinc-950 px-2 py-1"
          onChange={e => setNodoInicial(e.target.value)}
          value={nodoInicial}
          type="text"
          name="nodo-inicial"
          id="nodo-inicial"
        />
      </label>
      <label htmlFor="nodo-final">
        Nodo final:
        <input
          className="outline-none w-10 text-zinc-950 px-2 py-1"
          onChange={e => setNodoFinal(e.target.value)}
          value={nodoFinal}
          type="text"
          name="nodo-final"
          id="nodo-final"
        />
      </label>
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => setConexiones([])}
          className="p-2 text-xl font-bold hover:bg-red-800 active:bg-red-900 bg-red-600"
          type="button">
          <span>Borrar Conexiones</span>
        </button>
        <button
          onClick={handleCalcular}
          className="p-2 text-xl font-bold hover:bg-green-800 active:bg-green-900 bg-green-600"
          type="button">
          <span>Calcular</span>
        </button>
      </div>
    </div>
  )
}
