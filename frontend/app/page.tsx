import Header from "../src/Header";

// Helper to get ordinal suffix
function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Dummy data for leaderboard
const leaderboard = [
  {
    id: 1,
    name: "Alice Smith",
    year: 1,
    clubs: ["🏀", "💻", "🎨"],
    elo: 1520,
    img: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Bob Johnson",
    year: 2,
    clubs: ["🎵", "📚"],
    elo: 1480,
    img: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Carol Lee",
    year: 3,
    clubs: ["🤖", "🏊"],
    elo: 1450,
    img: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "David Kim",
    year: 4,
    clubs: ["🎮", "🎸"],
    elo: 1430,
    img: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Eva Green",
    year: 2,
    clubs: ["🎤", "🧩"],
    elo: 1410,
    img: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 6,
    name: "Frank Lee",
    year: 5,
    clubs: ["🧑‍🔬", "🏸"],
    elo: 1390,
    img: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 7,
    name: "Grace Park",
    year: 1,
    clubs: ["🎭", "🧗"],
    elo: 1370,
    img: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    name: "Henry Ford",
    year: 3,
    clubs: ["🚴", "🎬"],
    elo: 1350,
    img: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: 9,
    name: "Ivy Chen",
    year: 4,
    clubs: ["🎹", "🧘"],
    elo: 1330,
    img: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: 10,
    name: "Jack Black",
    year: 2,
    clubs: ["🏓", "🎲"],
    elo: 1310,
    img: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <div className="relative flex items-center gap-6 left-4">
          <span className="text-6xl font-bold text-black font-docallisme">NU</span>
          <span className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xl select-none"></span>
          <span className="text-6xl font-bold text-black font-docallisme">RANKED</span>
          <div className="absolute right-0 -bottom-6 text-sm text-red-800 py-0.5  font-mono">F25</div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-8">
        <div className="w-full max-w-2xl">
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.id}
              className={`flex items-center border border-black bg-white${idx === 0 ? ' border-t' : ' border-t-0'}`}
            >
              <div className="w-16 flex justify-center items-center px-2 py-2">
                <img
                  src={entry.img}
                  alt={entry.name}
                  className="w-12 h-12 object-cover border border-black"
                  style={{ borderRadius: 0 }}
                />
              </div>
              <div className="flex-1 px-2 py-2 text-black">{entry.name}</div>
              <div className="w-20 px-2 py-2 text-black">{ordinal(entry.year)}</div>
              <div className="w-32 px-2 py-2 text-black flex gap-1">
                {entry.clubs.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </div>
              <div className="w-20 px-2 py-2 text-lg font-mono text-black text-right">{entry.elo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
