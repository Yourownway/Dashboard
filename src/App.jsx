import React from 'react' 
import { useMemo, useState } from 'react';

const createProject = (name = 'Nouveau projet') => ({
  id: crypto.randomUUID(),
  name,
  content: '# Titre\n\nCommencez à écrire ici…',
  updatedAt: new Date().toISOString(),
});

function App() {
  const [projects, setProjects] = useState([
    createProject('Roadmap produit'),
    createProject('Notes marketing'),
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [search, setSearch] = useState('');

  const filteredProjects = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) {
      return projects;
    }

    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(value) ||
        project.content.toLowerCase().includes(value)
      );
    });
  }, [projects, search]);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null;

  const handleCreateProject = () => {
    const project = createProject(`Projet ${projects.length + 1}`);
    setProjects((prev) => [project, ...prev]);
    setSelectedProjectId(project.id);
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => {
      const next = prev.filter((project) => project.id !== id);
      if (id === selectedProjectId && next.length > 0) {
        setSelectedProjectId(next[0].id);
      }
      if (next.length === 0) {
        const fresh = createProject();
        setSelectedProjectId(fresh.id);
        return [fresh];
      }
      return next;
    });
  };

  const handleNameChange = (value) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? { ...project, name: value, updatedAt: new Date().toISOString() }
          : project,
      ),
    );
  };

  const handleContentChange = (value) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? { ...project, content: value, updatedAt: new Date().toISOString() }
          : project,
      ),
    );
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Mon dashboard</h1>
        <button type="button" onClick={handleCreateProject}>
          + Nouveau projet
        </button>
        <input
          type="search"
          placeholder="Rechercher"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <ul>
          {filteredProjects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className={selectedProject?.id === project.id ? 'project active' : 'project'}
                onClick={() => setSelectedProjectId(project.id)}
              >
                <span>{project.name || 'Sans titre'}</span>
                <small>{new Date(project.updatedAt).toLocaleString('fr-FR')}</small>
              </button>
            </li>
          ))}
          {filteredProjects.length === 0 && <li className="empty">Aucun projet trouvé</li>}
        </ul>
      </aside>

      {selectedProject && (
        <main className="editor">
          <header>
            <input
              className="title"
              value={selectedProject.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Titre du projet"
            />
            <button type="button" className="danger" onClick={() => handleDeleteProject(selectedProject.id)}>
              Supprimer
            </button>
          </header>

          <textarea
            value={selectedProject.content}
            onChange={(event) => handleContentChange(event.target.value)}
            placeholder="Écrivez votre contenu..."
          />
        </main>
      )}
    </div>
  );
}

export default App;
