export const disasters = [
  {
    type: "Flood",
    gradient: "from-blue-900 via-blue-700 to-cyan-600",
    video: "/videos/flood.mp4",
  },
  {
    type: "Fire",
    gradient: "from-red-900 via-orange-700 to-yellow-600",
    video: "/videos/fire.mp4",
  },
  {
    type: "Earthquake",
    gradient: "from-yellow-800 via-orange-700 to-red-700",
    video: "/videos/earthquake.mp4",
  },
  {
    type: "Cyclone",
    gradient: "from-purple-900 via-indigo-700 to-blue-700",
    video: "/videos/cyclone.mp4",
  },
];

export function getRandomDisaster() {
  return disasters[Math.floor(Math.random() * disasters.length)];
}
