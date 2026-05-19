'use client';

const protocols = [
  { name: "Max Movement Pro", emoji: "🏃", description: "Joint & Mobility Support", image: "https://ipfs.io/ipfs/bafybeihsdkc7yqpbslvu25yz4w6gqi2wvozenotkyebul5mn3pynszwshe" },
  { name: "Freedom Calm", emoji: "🧘", description: "Anxiety & Stress Relief", image: "https://ipfs.io/ipfs/bafybeibuyjkamozxyxt4vhenalwchlk34t6wjm3uapgltoxyjmtz3toyqu" },
  { name: "Foundation Liver & Kidney Detox", emoji: "🧪", description: "Gentle Organ Support", image: "https://ipfs.io/ipfs/bafybeigsubrahu7ya7vj7cwkxlj7miilgmslorydkbe7gynm7lo6opgus4" },
  { name: "Buddy's Gut Balance & Cleanse", emoji: "🌿", description: "Digestive Health", image: "https://ipfs.io/ipfs/bafybeicaj2kzbnvxduf3nvhf6fbvg3o4k56cudyd2vcepbaax2dbj2lmhe" },
  { name: "Infra-Red Spine & Joint", emoji: "🔴", description: "Spinal & Inflammation Support", image: "https://ipfs.io/ipfs/bafybeieubjoo4ugq3v3hhcjw26vtbmzb2j4m6xq4rdkha3wetkcstzblxm" },
  { name: "Allergy Shield", emoji: "🌸", description: "Skin & Coat Glow", image: "https://ipfs.io/ipfs/bafybeih7ha5m6zf6lq6a2mn7rmci6anxe3wedhrwllhleee6ytxlsffh7e" },
  { name: "Fresh Smile", emoji: "🦷", description: "Dental & Oral Health", image: "https://ipfs.io/ipfs/bafybeidcohhyfsdmocvlyftg2p5ooadz6jtydw6bxmyxjxakfpwiym6y7a" },
  { name: "Heart Strong", emoji: "❤️", description: "Cardiovascular Support", image: "https://ipfs.io/ipfs/bafybeieyagnfwx6rockakffiiewnucchfocjx4ut4nue2fe7crg43hvhzy" },
  { name: "Patriot Immune Defender", emoji: "🛡️", description: "Overall Immunity", image: "https://ipfs.io/ipfs/bafybeibv7tsjhk2dfiwroaapjh5lgasg6cxuh232os3ylglhrpxcgzja6q" },
  { name: "Clear Vision Defender", emoji: "👁️", description: "Eye Health Protocol", image: "https://ipfs.io/ipfs/bafybeihqiu7biox2p3htn6fp7i2cozx2ur6vjy4bpc6sbxdnswoxgxlyqe" },
];

export default function MyPets() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">My Pets</h1>
          <p className="text-[#A3BFFA] text-xl">Your Tokenized Dynamic NFT Protocols</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((protocol, index) => (
            <div key={index} className="bg-[#1F2A44] border border-[#334155] hover:border-[#F5C242] rounded-3xl overflow-hidden transition-all group">
              <div className="h-64 relative">
                <img src={protocol.image} alt={protocol.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-6">
                <div className="text-4xl mb-3">{protocol.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{protocol.name}</h3>
                <p className="text-[#A3BFFA] mb-6">{protocol.description}</p>
                <button className="w-full bg-[#F5C242] hover:bg-[#F5C242]/90 text-black font-bold py-4 rounded-2xl transition">
                  View / Update Record →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}