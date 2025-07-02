"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "./movie-card"
import type { Movie } from "@/lib/movies-data"

interface MovieRowProps {
  title: string
  movies: Movie[]
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  if (!movies.length) return null

  return (
    <div className="space-y-2 md:space-y-4">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white px-4 md:px-6">{title}</h2>
      <div className="relative group">
        {/* Left Arrow - Hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 hidden md:flex transition-opacity ${
            canScrollLeft ? "opacity-100" : "opacity-50 cursor-not-allowed"
          } group-hover:opacity-100`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </Button>

        {/* Right Arrow - Hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 hidden md:flex transition-opacity ${
            canScrollRight ? "opacity-100" : "opacity-50 cursor-not-allowed"
          } group-hover:opacity-100`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </Button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex space-x-2 md:space-x-3 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-2 scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-32 sm:w-36 md:w-40 lg:w-48" style={{ scrollSnapAlign: "start" }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center mt-2 md:hidden">
          <div className="flex space-x-1">
            {Array.from({ length: Math.ceil(movies.length / 3) }).map((_, index) => (
              <div key={index} className="w-1.5 h-1.5 rounded-full bg-white/30" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
