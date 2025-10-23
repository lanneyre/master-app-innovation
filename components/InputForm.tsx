import React from 'react';
import { BloomLevel } from '../types';
import { DocumentIcon } from './icons';

interface InputFormProps {
  sourceContent: string;
  setSourceContent: (content: string) => void;
  bloomLevel: BloomLevel;
  setBloomLevel: (level: BloomLevel) => void;
  onGenerate: () => void;
  isLoading: boolean;
  files: File[];
  // FIX: Updated `setFiles` type to allow functional updates for state.
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const InputForm: React.FC<InputFormProps> = ({
  sourceContent,
  setSourceContent,
  bloomLevel,
  setBloomLevel,
  onGenerate,
  isLoading,
  files,
  setFiles,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(f => f.name));
        const uniqueNewFiles = newFiles.filter(f => !existingFileNames.has(f.name));
        return [...prevFiles, ...uniqueNewFiles];
      });
    }
     // Reset the input value to allow re-uploading the same file after removal
     e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
        const newFiles = Array.from(e.dataTransfer.files);
        setFiles(prevFiles => {
            const existingFileNames = new Set(prevFiles.map(f => f.name));
            const uniqueNewFiles = newFiles.filter(f => !existingFileNames.has(f.name));
            return [...prevFiles, ...uniqueNewFiles];
        });
    }
  };

  const handleRemoveFile = (fileIndex: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== fileIndex));
  };

  const acceptedFiles = ".png, .jpg, .jpeg, .txt, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .odt, .ods, .odp";
  
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="source-content" className="block text-lg font-semibold text-slate-700 mb-2">
          Contenu Source Principal (Texte)
        </label>
        <textarea
          id="source-content"
          value={sourceContent}
          onChange={(e) => setSourceContent(e.target.value)}
          placeholder="Collez ici votre article, texte, ou notes de cours..."
          className="w-full h-48 p-4 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-y placeholder-slate-400 text-slate-900"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-lg font-semibold text-slate-700 mb-2">
            Fichiers Complémentaires
        </label>
        <div 
          onDragOver={handleDragOver} 
          onDrop={handleDrop}
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md"
        >
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Uploader des fichiers</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} disabled={isLoading} accept={acceptedFiles} />
              </label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-slate-500">
              Images, PDF, Documents (Word, Excel, PowerPoint), TXT
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div>
            <h3 className="text-md font-medium text-slate-700">Fichiers sélectionnés :</h3>
            <ul role="list" className="mt-2 border border-slate-200 rounded-md divide-y divide-slate-200">
                {files.map((file, index) => (
                    <li key={file.name} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                           <div className="h-5 w-5 text-slate-400" aria-hidden="true">
                             <DocumentIcon />
                           </div>
                            <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <button onClick={() => handleRemoveFile(index)} disabled={isLoading} className="font-medium text-red-600 hover:text-red-500 disabled:text-slate-400 disabled:cursor-not-allowed">
                                Supprimer
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      )}

      <div>
        <label htmlFor="bloom-level" className="block text-lg font-semibold text-slate-700 mb-2">
          Niveau de Complexité (Taxonomie de Bloom)
        </label>
        <select
          id="bloom-level"
          value={bloomLevel}
          onChange={(e) => setBloomLevel(e.target.value as BloomLevel)}
          className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          {Object.values(BloomLevel).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || (!sourceContent.trim() && files.length === 0)}
        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Génération en cours...
          </>
        ) : (
          'Générer les Ressources'
        )}
      </button>
    </div>
  );
};

export default InputForm;