
import React, { useState, useCallback } from 'react';
import { EducationalResources, BloomLevel } from './types';
import { generateResources } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [sourceContent, setSourceContent] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [bloomLevel, setBloomLevel] = useState<BloomLevel>(BloomLevel.Comprendre);
  const [generatedResources, setGeneratedResources] = useState<EducationalResources | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!sourceContent.trim() && files.length === 0) {
      setError('Le contenu source ou les fichiers ne peuvent pas être tous les deux vides.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedResources(null);

    try {
      const resources = await generateResources(sourceContent, bloomLevel, files);
      setGeneratedResources(resources);
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue lors de la génération des ressources. Assurez-vous que votre clé d'API est valide et réessayez. Détail: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [sourceContent, bloomLevel, files]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8 lg:mb-0">
             <InputForm
              sourceContent={sourceContent}
              setSourceContent={setSourceContent}
              bloomLevel={bloomLevel}
              setBloomLevel={setBloomLevel}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              files={files}
              setFiles={setFiles}
            />
          </div>

          <div className="relative">
            {isLoading && <Loader />}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
                <p className="font-bold">Erreur</p>
                <p>{error}</p>
              </div>
            )}
            {generatedResources && !isLoading && (
              <ResultsDisplay resources={generatedResources} />
            )}
            {!generatedResources && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">Prêt à créer ?</h2>
                    <p className="text-center max-w-sm">Entrez votre contenu, ajoutez des fichiers, choisissez un niveau de complexité, et cliquez sur "Générer".</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Propulsé par Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
