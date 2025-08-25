interface TitleStepProps {
  title: string;
  setTitle: (title: string) => void;
  onNext: () => void;
}

export const TitleStep = ({ title, setTitle, onNext }: TitleStepProps) => {
  const handleNext = () => {
    if (title.trim()) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">TITLE YOUR RESLINK</h2>
      
      <div className="max-w-2xl">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Give your Reslink a title that reflects the company and position you're applying for.
          </p>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Amy Jones - Product Manager - Meta"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="mb-8">
          <a href="#" className="text-blue-600 text-sm underline hover:text-blue-700">
            Pro tips of creating your Reslink title
          </a>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleNext}
            disabled={!title.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};