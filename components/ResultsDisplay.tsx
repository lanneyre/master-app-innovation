
import React, { useState } from 'react';
import { EducationalResources } from '../types';
import { QuizIcon, CaseStudyIcon, VideoScriptIcon, InfographicIcon, ActivityIcon } from './icons';

interface ResultsDisplayProps {
  resources: EducationalResources;
}

type Tab = 'quiz' | 'caseStudy' | 'videoScript' | 'infographic' | 'activity';

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ resources }) => {
  const [activeTab, setActiveTab] = useState<Tab>('quiz');

  // FIX: Replace JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const tabs: { id: Tab; label: string; icon: React.ReactElement }[] = [
    { id: 'quiz', label: 'Quiz', icon: <QuizIcon /> },
    { id: 'caseStudy', label: 'Étude de Cas', icon: <CaseStudyIcon /> },
    { id: 'videoScript', label: 'Script Vidéo', icon: <VideoScriptIcon /> },
    { id: 'infographic', label: 'Infographie', icon: <InfographicIcon /> },
    { id: 'activity', label: 'Activité', icon: <ActivityIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'quiz':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">{resources.quiz.title}</h3>
            {resources.quiz.questions.map((q, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  {q.options.map((opt, i) => (
                    <li key={i} className={opt === q.correctAnswer ? 'text-green-700 font-medium' : ''}>{opt}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-600 bg-slate-200 p-2 rounded-md"><strong className="font-semibold">Explication :</strong> {q.explanation}</p>
              </div>
            ))}
          </div>
        );
      case 'caseStudy':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">{resources.caseStudy.title}</h3>
            <div className="prose max-w-none p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold">Scénario:</h4>
                <p>{resources.caseStudy.scenario}</p>
            </div>
             <div className="prose max-w-none p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold">Questions:</h4>
                <ol className="list-decimal list-inside">
                    {resources.caseStudy.questions.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
            </div>
          </div>
        );
       case 'videoScript':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">{resources.videoScript.title}</h3>
            <div className="space-y-4">
              {resources.videoScript.scenes.map((scene) => (
                <div key={scene.sceneNumber} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div>
                    <h4 className="font-semibold text-slate-700">Scène {scene.sceneNumber} : Visuels</h4>
                    <p className="text-sm text-slate-600 mt-1">{scene.visuals}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">Narration</h4>
                    <p className="text-sm text-slate-600 mt-1">{scene.narration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'infographic':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">{resources.infographic.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.infographic.keyPoints.map((point, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col">
                  <p className="font-semibold text-slate-800 flex-grow">{point.point}</p>
                  <p className="text-xs text-blue-600 mt-2 pt-2 border-t border-slate-200">Suggestion Visuelle: {point.visualSuggestion}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">{resources.activity.title}</h3>
            <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold">Description:</h4>
                <p className="mt-1">{resources.activity.description}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold">Étapes:</h4>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                    {resources.activity.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold">Matériel Requis:</h4>
                <ul className="list-disc list-inside mt-1 space-y-1">
                    {resources.activity.materials.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-150
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
                <span className="mr-2 h-5 w-5">{tab.icon}</span>
                {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultsDisplay;
