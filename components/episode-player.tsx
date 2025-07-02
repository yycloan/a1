"use client"

import { useState, useEffect } from "react"
import { Play, SkipBack, SkipForward, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Movie } from "@/lib/movies-data"

interface EpisodePlayerProps {
  movie: Movie
  episodeIndex: number
}

export default function EpisodePlayer({ movie, episodeIndex }: EpisodePlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false)

  const currentEpisode = movie.multipleDownloads[episodeIndex]
  const hasPrevious = episodeIndex > 0
  const hasNext = episodeIndex < movie.multipleDownloads.length - 1

  const handlePlay = () => {
    setShowPlayer(true)
  }

  const getEmbedCode = () => {
    if (currentEpisode.embedCode) {
      return currentEpisode.embedCode
    }
    // Fallback if no embed code
    return `<iframe src="${currentEpisode.url}" width="100%" height="100%" allowfullscreen allowtransparency allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; web-share; camera; microphone" scrolling="no" frameborder="0" style="border: none; width: 100%; height: 100%;"></iframe>`
  }

  // Auto-play when component mounts
  useEffect(() => {
    setShowPlayer(true)
  }, [episodeIndex])

  if (!movie.multipleDownloads || episodeIndex < 0 || episodeIndex >= movie.multipleDownloads.length) {
    return null
  }

  return (
    <div className="w-full mb-6">
      <Card className="w-full">
        <CardContent className="p-0">
          {showPlayer && getEmbedCode() ? (
            <div
              className="relative w-full bg-black rounded-t-lg overflow-hidden"
              style={{ aspectRatio: "16/9", minHeight: "280px" }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: getEmbedCode()
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
                    <p className="text-red-400 font-medium">{currentEpisode.label}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Episode Navigation */}
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
              <div>
                <h4 className="font-semibold text-lg">{currentEpisode.label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Episode {episodeIndex + 1} of {movie.multipleDownloads.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowPlayer(true)} className="bg-red-600 hover:bg-red-700" size="sm">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Replay
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasPrevious}
                asChild={hasPrevious}
                className="flex-1 md:flex-none bg-transparent"
              >
                {hasPrevious ? (
                  <Link href={`/movie/${movie.slug}/episode/${episodeIndex}`}>
                    <SkipBack className="w-4 h-4 mr-2" />
                    Previous Episode
                  </Link>
                ) : (
                  <>
                    <SkipBack className="w-4 h-4 mr-2" />
                    Previous Episode
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!hasNext}
                asChild={hasNext}
                className="flex-1 md:flex-none bg-transparent"
              >
                {hasNext ? (
                  <Link href={`/movie/${movie.slug}/episode/${episodeIndex + 2}`}>
                    Next Episode
                    <SkipForward className="w-4 h-4 ml-2" />
                  </Link>
                ) : (
                  <>
                    Next Episode
                    <SkipForward className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom spacing */}
      <div className="h-4"></div>
    </div>
  )
}
