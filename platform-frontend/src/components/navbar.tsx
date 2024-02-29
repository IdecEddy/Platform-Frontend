export function DesktopNav() {
  return (
    <div className="w-64 h-screen bg-stone-400 flex flex-col">
      <div className="bg-stone-600 w-full h-16 flex justify-center items-center font-bold text-white">
        Platform
      </div>
      <div className="flex flex-col flex-grow">
        <p className="p-3 hover:bg-stone-300 transition-colors duration-200 cursor-pointer">Home</p>
        <p className="p-3 hover:bg-stone-300 transition-colors duration-200 cursor-pointer">Clusters</p>
        <p className="p-3 hover:bg-stone-300 transition-colors duration-200 cursor-pointer">Nodes</p>
      </div>
      <button 
        className="w-full py-3 bg-stone-600 text-white font-bold hover:bg-stone-700 transition-colors duration-200"
        onClick={() => {}}
      >
        Logout
      </button>
    </div>
  );
}
