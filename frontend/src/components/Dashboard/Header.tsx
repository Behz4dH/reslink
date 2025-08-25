export const Header = () => {
  return (
    <div className="fixed top-0 right-0 left-60 h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-40">
      <h1 className="text-2xl font-bold text-gray-900">CREATE A RESLINK</h1>
      
      <div className="flex items-center gap-4">
        <button className="bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-lime-500">
          + New Reslink
        </button>
        
        <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-sm font-medium">
          BH
        </div>
      </div>
    </div>
  );
};