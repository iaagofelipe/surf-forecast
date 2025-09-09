"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const spots = [
  { name: "Taíba", location: "São Gonçalo do Amarante, CE", slug: "taiba" },
  { name: "Paracuru", location: "Paracuru, CE", slug: "paracuru" },
  { name: "Icaraí de Amontada", location: "Amontada, CE", slug: "icarai" },
  { name: "Canoa Quebrada", location: "Aracati, CE", slug: "canoa-quebrada" },
  { name: "Jericoacoara", location: "Jijoca de Jericoacoara, CE", slug: "jericoacoara" },
  { name: "Cumbuco", location: "Caucaia, CE", slug: "cumbuco" },
  { name: "Pecém", location: "São Gonçalo do Amarante, CE", slug: "pecem" },
  { name: "Lagoinha", location: "Paraipaba, CE", slug: "lagoinha" },
]

export function SpotSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filteredSpots = spots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(query.toLowerCase()) ||
      spot.location.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Digite o nome do pico (ex: Taíba, Paracuru...)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.length > 0)
          }}
          onFocus={() => setIsOpen(query.length > 0)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10"
        />
      </div>

      {isOpen && filteredSpots.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            {filteredSpots.map((spot) => (
              <Link key={spot.slug} href={`/spot/${spot.slug}`}>
                <div className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{spot.name}</p>
                    <p className="text-sm text-muted-foreground">{spot.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
