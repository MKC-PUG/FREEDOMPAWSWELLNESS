export default function ProtocolsPage() {
    const protocols = [
      { name: "Buddy's Gut Balance & Cleanse", emoji: "🦴", desc: "Digestive health and microbiome support" },
      { name: "Max Movement Pro", emoji: "🏃", desc: "Joint mobility and stiffness relief" },
      { name: "Clear Vision Defender", emoji: "👁️", desc: "Eye health and vision support" },
      { name: "Allergy Shield", emoji: "🛡️", desc: "Skin, itch, and allergy relief" },
      { name: "Heart Vitality Pro", emoji: "❤️", desc: "Cardiovascular and energy support" },
      { name: "Foundation Liver & Kidney Detox", emoji: "🧹", desc: "Organ detox and filtration" },
      { name: "Immune Boost Pro", emoji: "🛡️", desc: "Overall immune system strength" },
      { name: "Dental Defense Pro", emoji: "🦷", desc: "Oral health and fresh breath" },
      { name: "Freedom Calm Support", emoji: "🧘", desc: "Anxiety and stress relief" },
      { name: "Joyful Smile Pro", emoji: "😄", desc: "Dental + mood enhancement and happiness support" },
    ];
  
    return (
      <div className="min-h-screen bg-[#0A1428] text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4">Protocol Overview</h1>
          <p className="text-center text-[#F5C242] text-xl mb-12">Our 10 Tokenized Holistic Wellness Protocols</p>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {protocols.map((protocol, index) => (
              <div 
                key={index} 
                className="bg-[#1F2A44] border border-[#F5C242]/30 rounded-3xl p-8 hover:border-[#F5C242] transition-all group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{protocol.emoji}</div>
                <h3 className="text-2xl font-bold mb-3">{protocol.name}</h3>
                <p className="text-gray-300 mb-6">{protocol.desc}</p>
                <div className="text-[#F5C242] text-sm font-medium">Dynamic NFT • Tokenized on XRPL</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }