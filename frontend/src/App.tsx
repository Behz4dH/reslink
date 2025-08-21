import { AppProvider, useAppContext } from './contexts/AppContext';
import { PitchForm } from './components/PitchForm/PitchForm';
import { ScriptEditor } from './components/ScriptEditor/ScriptEditor';
import { Teleprompter } from './components/Teleprompter/Teleprompter';
import { usePitchGeneration } from './hooks/usePitchGeneration';
import { useLocalStorage } from './hooks/useLocalStorage';

function AppContent() {
  const { state, dispatch } = useAppContext();
  const { loading, error, generatePitch } = usePitchGeneration();
  const [, setSavedScript] = useLocalStorage('pitchcraft-script', '');

  const handlePitchSubmit = async (input: any) => {
    try {
      const pitch = await generatePitch(input);
      dispatch({ type: 'SET_PITCH', payload: pitch });
    } catch (err) {
      console.error('Failed to generate pitch:', err);
    }
  };

  const handleScriptChange = (script: string) => {
    dispatch({ type: 'UPDATE_SCRIPT', payload: script });
    setSavedScript(script);
  };

  const handlePractice = () => {
    dispatch({ type: 'SET_STEP', payload: 'teleprompter' });
  };

  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
  };

  const handleExitTeleprompter = () => {
    dispatch({ type: 'SET_STEP', payload: 'editor' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleStartOver}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {state.currentStep === 'input' && (
        <PitchForm onSubmit={handlePitchSubmit} loading={loading} />
      )}

      {state.currentStep === 'editor' && state.pitch && (
        <ScriptEditor
          pitch={state.pitch}
          onScriptChange={handleScriptChange}
          onPractice={handlePractice}
          onStartOver={handleStartOver}
        />
      )}

      {state.currentStep === 'teleprompter' && (
        <Teleprompter
          script={state.editedScript}
          onExit={handleExitTeleprompter}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
