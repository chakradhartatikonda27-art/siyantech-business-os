export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center" 
      style={{background: "#FFF9FD"}}>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-4xl font-bold"
            style={{background: "linear-gradient(135deg,#6F32B3,#B770CE)"}}>
            S
          </div>
        </div>
        <h1 className="text-4xl font-bold" style={{color: "#6F32B3"}}>
          SiyanTech Business OS
        </h1>
        <p className="mt-3 text-lg" style={{color: "#5C5470"}}>
          SiyanTech Global Innovations Pvt. Ltd.
        </p>
        <p className="mt-1" style={{color: "#5C5470"}}>
          Visakhapatnam · ISO 9001:2015 · ISO/IEC 27001:2022
        </p>
        <div className="mt-8">
          <a href="/dashboard" 
            className="px-8 py-3 rounded-xl text-white font-semibold text-lg"
            style={{background: "linear-gradient(135deg,#6F32B3,#B770CE)"}}>
            Go to Dashboard →
          </a>
        </div>
      </div>
    </main>
  );
}
