
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8 py-4 text-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Générateur de Ressources Pédagogiques <span className="text-blue-600">IA</span>
        </h1>
        <p className="text-slate-500 mt-1">
          Transformez n'importe quel contenu en matériel d'apprentissage engageant.
        </p>
      </div>
    </header>
  );
};

export default Header;
