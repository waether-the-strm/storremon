export const emptyPokemonCardProps = {
  imageUrl: "",
  title: "Mysterious Pokémon",
  subtitle: "Invisible • Elusive",
  value: "404cm",
  isRevealed: true,
  category: "#404",
  badge: { text: "POKÉ", variant: "pokemon" as const },
  fallbackText: "( ͡° ͜ʖ ͡°)",
  hasFlip: true,
  metadata: {
    type: "Unknown",
    gen: "Gen ?",
    status: "Hidden",
    ability: "Invisibility",
  },
};

export const emptyArtCardProps = {
  imageUrl: "",
  title: "Lost Artwork",
  subtitle: "Unknown Artist",
  value: "∞cm",
  isRevealed: true,
  category: "#404",
  badge: { text: "ART", variant: "art" as const },
  fallbackText: "(╯°□°）╯︵ ┻━┻",
  hasFlip: true,
  metadata: {
    period: "Wifi Era",
    artist: "Unknown",
    status: "On a break",
    location: "Coffee Shop",
  },
};
