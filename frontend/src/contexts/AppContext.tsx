import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GeneratedPitch } from '../types';

interface AppState {
  currentStep: 'input' | 'editor' | 'teleprompter';
  pitch: GeneratedPitch | null;
  editedScript: string;
}

type AppAction =
  | { type: 'SET_STEP'; payload: AppState['currentStep'] }
  | { type: 'SET_PITCH'; payload: GeneratedPitch }
  | { type: 'UPDATE_SCRIPT'; payload: string }
  | { type: 'RESET' };

const initialState: AppState = {
  currentStep: 'input',
  pitch: null,
  editedScript: '',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_PITCH':
      return {
        ...state,
        pitch: action.payload,
        editedScript: action.payload.script,
        currentStep: 'editor',
      };
    case 'UPDATE_SCRIPT':
      return { ...state, editedScript: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};