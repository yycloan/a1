"use client"

import { useState } from "react"
import { Play, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Movie } from "@/lib/movies-data"

interface MoviePlayerProps {
  movie: Movie
}

export default function MoviePlayer({ movie }: MoviePlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState(0)

  const handlePlay = () => {
    setShowPlayer(true)
  }

  const handleEpisodeSelect = (index: number) => {
    setSelectedEpisode(index)
    setShowPlayer(true)
  }

  const getCurrentEmbedCode = () => {
    if (movie.multipleDownloads && movie.multipleDownloads[selectedEpisode]?.embedCode) {
      return movie.multipleDownloads[selectedEpisode].embedCode
    }
    // Fallback to videoUrl if no embed code
    if (movie.videoUrl) {
      return `<iframe src="${movie.videoUrl}" width="100%" height="100%" allowfullscreen allowtransparency allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; web-share; camera; microphone" scrolling="no" frameborder="0" style="border: none; width: 100%; height: 100%;"></iframe>`
    }
    return null
  }

  const getCurrentDownloadUrl = () => {
    if (movie.multipleDownloads && movie.multipleDownloads[selectedEpisode]) {
      return movie.multipleDownloads[selectedEpisode].url
    }
    return movie.downloadUrl
  }

  return (
    <div className="w-full mb-6">
      <Card className="w-full">
        <CardContent className="p-0">
          {showPlayer && getCurrentEmbedCode() ? (
            <div
              className="relative w-full bg-black rounded-t-lg overflow-hidden"
              style={{ aspectRatio: "16/9", minHeight: "280px" }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: getCurrentEmbedCode()!
                    .replace(/width="[^"]*"/g, 'width="100%"')
                    .replace(/height="[^"]*"/g, 'height="100%"')
                    .replace(/frameborder="[^"]*"/g, 'frameborder="0"')
                    .replace(/scrolling="[^"]*"/g, 'scrolling="no"')
                    .replace(/allowtransparency="[^"]*"/g, 'allowtransparency="true"')
                    .replace(
                      /style="[^"]*"/g,
                      'style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; display: block;"',
                    )
                    .replace(
                      /allow="[^"]*"/g,
                      'allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *; gyroscope *; accelerometer *; clipboard-write *; web-share *; camera *; microphone *"',
                    )
                    .replace(
                      /<iframe(?![^>]*allowfullscreen)/g,
                      '<iframe allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" msallowfullscreen="true" oallowfullscreen="true" allowtransparency="true"',
                    ),
                }}
              />
            </div>
          ) : (
            <div
              className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-lg overflow-hidden"
              style={{ aspectRatio: "16/9", minHeight: "280px" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage: `url(${movie.backdrop || movie.poster})`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div
                    className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto hover:bg-red-700 transition-colors cursor-pointer"
                    onClick={handlePlay}
                  >
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                    <p className="text-gray-300 text-sm">{movie.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Episode Navigation for Series */}
          {movie.multipleDownloads && movie.multipleDownloads.length > 1 && (
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                <h4 className="font-semibold text-lg">Episodes</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEpisodeSelect(Math.max(0, selectedEpisode - 1))}
                    disabled={selectedEpisode === 0}
                    className="text-xs"
                  >
                    ← Previous
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                    {selectedEpisode + 1} of {movie.multipleDownloads.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleEpisodeSelect(Math.min(movie.multipleDownloads.length - 1, selectedEpisode + 1))
                    }
                    disabled={selectedEpisode === movie.multipleDownloads.length - 1}
                    className="text-xs"
                  >
                    Next →
                  </Button>
                </div>
              </div>

              {/* Current Episode Info */}
              <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-medium text-sm">Now Playing:</h5>
                    <p className="text-lg font-semibold text-red-600">
                      {movie.multipleDownloads[selectedEpisode].label}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleEpisodeSelect(selectedEpisode)}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Replay
                  </Button>
                </div>
              </div>

              {/* Episode Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {movie.multipleDownloads.map((episode, index) => (
                  <Button
                    key={index}
                    variant={selectedEpisode === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEpisodeSelect(index)}
                    className={`text-xs h-8 ${
                      selectedEpisode === index
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    }`}
                  >
                    {episode.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 border-t">
            <div className="flex flex-wrap gap-2">
              {(movie.videoUrl || getCurrentEmbedCode()) && (
                <Button onClick={handlePlay} className="bg-red-600 hover:bg-red-700">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
              )}

              {getCurrentDownloadUrl() && (
                <Button variant="outline" asChild>
                  <a href={getCurrentDownloadUrl()} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}

              {movie.multipleDownloads && (
                <div className="flex flex-wrap gap-2">
                  {movie.multipleDownloads.map((download, index) => (
                    <Button key={index} variant="outline" size="sm" asChild>
                      <a href={download.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {download.label}
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom spacing */}
      <div className="h-4"></div>
    </div>
  )
}
