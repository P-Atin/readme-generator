import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

// On définit les données par défaut à l'extérieur pour pouvoir les réutiliser
const DEFAULT_DATA = {
  title: "Project Alpha",
  description: "Une application web révolutionnaire construite avec React.",
  githubUser: "elie-dev",
  repoName: "project-alpha",
  installation: "npm install",
  usage: "npm run dev",
  features: "Mode sombre inclus\nPerformance optimisée\nInterface responsive",
  author: "Elie",
  license: "MIT"
};

function App() {
  const [formData, setFormData] = useState(DEFAULT_DATA);

  // --- LOGIQUE DE SAUVEGARDE LOCALE ---
  
  // 1. Charger les données au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('readme-data');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // 2. Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem('readme-data', JSON.stringify(formData));
  }, [formData]);

  // --- FONCTIONS D'ACTION ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (window.confirm("Es-tu sûr de vouloir tout effacer ? Cette action est irréversible.")) {
      setFormData(DEFAULT_DATA);
      localStorage.removeItem('readme-data');
      toast.error("Formulaire réinitialisé");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownResult);
    toast.success('README copié ! 🚀');
  };

  const downloadReadme = () => {
    const element = document.createElement("a");
    const file = new Blob([markdownResult], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "README.md";
    document.body.appendChild(element); 
    element.click();
    toast.success('Téléchargement lancé !');
  };

  // --- RENDU MARKDOWN ---
  const markdownResult = `
# ${formData.title}

![License](https://img.shields.io/badge/license-${formData.license}-blue.svg)

> ${formData.description}

## ✨ Features
${formData.features.split('\n').filter(f => f.trim() !== '').map(f => `- ${f}`).join('\n')}

## 🚀 Installation
\`\`\`bash
${formData.installation}
\`\`\`

## 💻 Utilisation
\`\`\`bash
${formData.usage}
\`\`\`

---
👤 **Auteur** : [${formData.author}](https://github.com/${formData.githubUser})
  `.trim();

  return (
    <div className="app-container">
      <Toaster position="bottom-right" />
      
      <header>
        <div className="logo">README.<span>gen</span></div>
        <div className="header-actions">
          <button className="btn btn-danger" onClick={handleReset}>Réinitialiser</button>
          <button className="btn btn-outline" onClick={copyToClipboard}>Copier</button>
          <button className="btn btn-primary" onClick={downloadReadme}>Télécharger .md</button>
        </div>
      </header>

      <main>
        <section className="editor-section">
          <div className="section-header">
            <h2>Éditeur</h2>
            <p>Modifie tes infos, c'est sauvegardé automatiquement !</p>
          </div>
          
          <div className="input-group">
            <label>Titre du Projet</label>
            <input name="title" value={formData.title} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} />
          </div>

          <div className="row-grid">
            <div className="input-group">
              <label>Pseudo GitHub</label>
              <input name="githubUser" value={formData.githubUser} onChange={handleInputChange} />
            </div>
            <div className="input-group">
              <label>Nom du Repo</label>
              <input name="repoName" value={formData.repoName} onChange={handleInputChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Fonctionnalités (une par ligne)</label>
            <textarea name="features" value={formData.features} onChange={handleInputChange} rows="5" />
          </div>

          <div className="row-grid">
            <div className="input-group">
              <label>Auteur</label>
              <input name="author" value={formData.author} onChange={handleInputChange} />
            </div>
            <div className="input-group">
              <label>Licence</label>
              <select name="license" value={formData.license} onChange={handleInputChange}>
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL v3</option>
              </select>
            </div>
          </div>
        </section>

        <section className="preview-section">
          <div className="markdown-card">
            <div className="markdown-body">
              <ReactMarkdown>{markdownResult}</ReactMarkdown>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;