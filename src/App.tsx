import { useState, useMemo, ChangeEvent } from 'react';
import { Search, Copy, Check, Terminal, MessageSquare, Sparkles, Variable, X, Hash, ArrowUpRight } from 'lucide-react';
import './App.css';

interface Item {
  id: string;
  category: string;
  content: string;
  description: string;
  tags: string[];
}

const COMMANDS: Item[] = [
  // Gemini CLI
  { id: 'gemini-1', category: 'Gemini CLI', content: 'gemini "explain the following code: [CODE]"', description: 'Ask Gemini to explain code snippets', tags: ['ai', 'gemini', 'explain'] },
  { id: 'gemini-2', category: 'Gemini CLI', content: 'gemini analyze [PATH]', description: 'Analyze a specific path in the codebase', tags: ['ai', 'gemini', 'analyze'] },
  { id: 'gemini-3', category: 'Gemini CLI', content: 'gemini --help', description: 'Show all available Gemini CLI commands', tags: ['ai', 'gemini', 'help'] },
  
  // Codex CLI
  { id: 'codex-1', category: 'Codex CLI', content: 'codex chat "[QUESTION]"', description: 'Interactive chat with Codex for coding questions', tags: ['ai', 'codex', 'css'] },
  { id: 'codex-2', category: 'Codex CLI', content: 'codex complete "[FUNCTION_STUB]"', description: 'Autocomplete code using Codex', tags: ['ai', 'codex', 'complete'] },
  
  // Claude CLI
  { id: 'claude-1', category: 'Claude CLI', content: 'claude "review this PR: [PR_LINK]"', description: 'Ask Claude to review a pull request', tags: ['ai', 'claude', 'pr'] },
  { id: 'claude-2', category: 'Claude CLI', content: 'claude -p "Refactor this for performance: [CODE]"', description: 'Ask Claude to refactor code', tags: ['ai', 'claude', 'refactor'] },

  // Node & NPM
  { id: 'npm-1', category: 'NPM', content: 'npm init -y', description: 'Quickly initialize a new project', tags: ['node', 'npm', 'init'] },
  { id: 'npm-2', category: 'NPM', content: 'npm install --save-dev [PACKAGE_NAME]', description: 'Install a specific dev dependency', tags: ['node', 'npm', 'install'] },
  { id: 'npm-3', category: 'NPM', content: 'npx [PACKAGE_NAME] [ARGS]', description: 'Execute a package without installing it globally', tags: ['node', 'npx', 'execute'] },
  { id: 'npm-4', category: 'NPM', content: 'npm run [SCRIPT_NAME]', description: 'Run a script defined in package.json', tags: ['node', 'npm', 'run'] },
  { id: 'node-1', category: 'Node', content: 'node --watch [FILENAME].js', description: 'Run node with native watch mode', tags: ['node', 'watch'] },
  { id: 'node-2', category: 'Node', content: 'node -v', description: 'Check installed Node.js version', tags: ['node', 'version'] },

  // Python & Pip
  { id: 'python-1', category: 'Python', content: 'python -m venv [VENV_NAME]', description: 'Create a virtual environment', tags: ['python', 'venv'] },
  { id: 'python-2', category: 'Python', content: 'python -m http.server [PORT]', description: 'Start a simple HTTP server', tags: ['python', 'server'] },
  { id: 'pip-1', category: 'Pip', content: 'pip install -r [FILE]', description: 'Install project dependencies', tags: ['python', 'pip', 'install'] },
  { id: 'pip-2', category: 'Pip', content: 'pip freeze > requirements.txt', description: 'Export current dependencies', tags: ['python', 'pip', 'freeze'] },

  // Docker
  { id: 'docker-1', category: 'Docker', content: 'docker-compose up -d', description: 'Start docker containers in detached mode', tags: ['docker', 'devops'] },
  { id: 'docker-2', category: 'Docker', content: 'docker exec -it <container_id> /bin/bash', description: 'Enter a running container shell', tags: ['docker', 'shell'] },
  { id: 'docker-3', category: 'Docker', content: 'docker logs -f <container_name>', description: 'Follow logs for a specific container', tags: ['docker', 'logs'] },
  { id: 'docker-4', category: 'Docker', content: 'docker build -t [IMAGE_NAME]:[TAG] .', description: 'Build a Docker image from a Dockerfile', tags: ['docker', 'build'] },
  { id: 'docker-5', category: 'Docker', content: 'docker system prune -a', description: 'Remove ALL unused images and volumes', tags: ['docker', 'cleanup'] },

  // Databases
  { id: 'mongo-1', category: 'MongoDB', content: 'mongosh "mongodb://[HOST]:[PORT]/[DB]"', description: 'Connect to MongoDB shell', tags: ['database', 'mongo'] },
  { id: 'mongo-2', category: 'MongoDB', content: 'db.[COLLECTION].find().pretty()', description: 'Query documents with formatting', tags: ['database', 'mongo', 'query'] },
  { id: 'pg-1', category: 'PostgreSQL', content: 'psql -U [USER] -d [DB_NAME]', description: 'Connect to PostgreSQL shell', tags: ['database', 'postgres'] },
  { id: 'pg-2', category: 'PostgreSQL', content: '\\dt', description: 'List all tables in current DB', tags: ['database', 'postgres', 'list'] },
  { id: 'pg-3', category: 'PostgreSQL', content: 'pg_dump -U [USER] [DB_NAME] > backup.sql', description: 'Backup a PostgreSQL database', tags: ['database', 'postgres', 'backup'] },

  // Git
  { id: 'git-0', category: 'Git', content: 'git clone [REPO_URL]', description: 'Clone a repository into a new directory', tags: ['git', 'clone', 'setup'] },
  { id: 'git-1', category: 'Git', content: 'git checkout -b [BRANCH_NAME]', description: 'Create and switch to a new branch', tags: ['git', 'branch'] },
  { id: 'git-2', category: 'Git', content: 'git commit -am "[MESSAGE]"', description: 'Add all changes and commit', tags: ['git', 'commit'] },
  { id: 'git-3', category: 'Git', content: 'git push origin [BRANCH]', description: 'Push local commits to remote', tags: ['git', 'push'] },
  { id: 'git-4', category: 'Git', content: 'git pull origin [BRANCH]', description: 'Fetch and merge remote changes', tags: ['git', 'pull'] },
  { id: 'git-5', category: 'Git', content: 'git status', description: 'Show the working tree status', tags: ['git', 'status'] },
  { id: 'git-6', category: 'Git', content: 'git stash push -m "[MESSAGE]"', description: 'Stash changes with a label', tags: ['git', 'stash'] },
  { id: 'git-7', category: 'Git', content: 'git remote -v', description: 'List all remote repositories', tags: ['git', 'remote'] },

  // General Utils
  { id: 'util-1', category: 'General', content: 'cp .env.example .env', description: 'Initialize environment variables', tags: ['util', 'env', 'setup'] },
  { id: 'util-2', category: 'General', content: 'mkdir -p [DIR_PATH]', description: 'Create nested directories', tags: ['util', 'fs'] },
];

const PROMPTS: Item[] = [
  { 
    id: 'p-1', 
    category: 'Refactor', 
    content: 'Act as a Senior Software Engineer specializing in [LANGUAGE]. Refactor the following code for maximum performance, readability, and type safety. Explain your reasoning using a step-by-step "Chain-of-Thought" approach before providing the final code: [CODE]', 
    description: 'Elite refactoring with technical rationale', 
    tags: ['senior-engineer', 'performance', 'refactor'] 
  },
  { 
    id: 'p-2', 
    category: 'Debug', 
    content: 'Act as an expert Debugger. I am encountering this error: [ERROR_MESSAGE]. Here is the relevant code context: [CODE]. First, perform a root cause analysis (RCA). Second, provide a surgical fix. Third, suggest a preventative measure or unit test to avoid regression.', 
    description: 'Systematic debugging and root cause analysis', 
    tags: ['debug', 'rca', 'fix'] 
  },
  { 
    id: 'p-3', 
    category: 'Architecture', 
    content: 'Act as a Solution Architect. Review the following system requirements/code: [CONTEXT]. Propose a scalable architecture or design pattern that satisfies these needs. Discuss trade-offs regarding cost, complexity, and maintainability.', 
    description: 'High-level system design and patterns', 
    tags: ['architecture', 'design-patterns', 'strategy'] 
  },
  { 
    id: 'p-4', 
    category: 'Code Review', 
    content: 'Act as a meticulous Security Auditor and Peer Reviewer. Analyze the following code for potential security vulnerabilities (XSS, Injection, etc.), logic flaws, and adherence to [STYLE_GUIDE] conventions. Provide your feedback in a structured bullet-point list.', 
    description: 'Security-focused PR review', 
    tags: ['security', 'audit', 'code-review'] 
  },
  { 
    id: 'p-5', 
    category: 'Testing', 
    content: 'Act as a QA Engineer. Generate a comprehensive suite of unit tests for the following function using [TEST_FRAMEWORK]. Ensure you cover happy paths, edge cases (null/undefined), and potential boundary errors: [CODE]', 
    description: 'Complete unit test suite generation', 
    tags: ['qa', 'test', 'vitest', 'jest'] 
  },
  { 
    id: 'p-6', 
    category: 'SQL Optimization', 
    content: 'Act as a Database Administrator (DBA). Optimize this SQL query for [DB_TYPE]. It is currently performing poorly on large datasets. Suggest necessary indexes, structural changes, or query rewrites to improve execution time: [QUERY]', 
    description: 'DBA-level database performance tuning', 
    tags: ['sql', 'postgres', 'optimization'] 
  },
  { 
    id: 'p-7', 
    category: 'Learning', 
    content: 'Act as a world-class Technical Teacher. Explain the following complex concept or code block to a [TARGET_AUDIENCE]. Use analogies where appropriate and break down the "magic" into understandable logical steps: [CONCEPT_OR_CODE]', 
    description: 'Simplify complex technical topics', 
    tags: ['education', 'explanation', 'learning'] 
  },
];

type ViewMode = 'terminal' | 'prompts';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('terminal');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [itemVars, setItemVars] = useState<Record<string, Record<string, string>>>({});

  const activeData = viewMode === 'terminal' ? COMMANDS : PROMPTS;
  const categories = useMemo(() => ['All', ...Array.from(new Set(activeData.map(c => c.category)))], [activeData]);
  
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    activeData.forEach(item => item.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [activeData]);

  const filteredItems = useMemo(() => {
    return activeData.filter(item => {
      const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesTag = !selectedTag || item.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [activeData, searchTerm, selectedCategory, selectedTag]);

  const handleViewToggle = (mode: ViewMode) => {
    setViewMode(mode);
    resetFilters();
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedTag(null);
    setSearchTerm('');
  };

  const extractVars = (content: string) => {
    const regex = /\[([^\]]+)\]|<([^>]+)>/g;
    const vars: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      vars.push(match[1] || match[2]);
    }
    return Array.from(new Set(vars));
  };

  const getSubstitutedContent = (item: Item) => {
    let content = item.content;
    const vars = extractVars(item.content);
    const values = itemVars[item.id] || {};
    
    vars.forEach(v => {
      const val = values[v] || `[${v}]`;
      const escapedV = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\[${escapedV}\\]|<${escapedV}>`, 'g');
      content = content.replace(pattern, val);
    });
    
    return content;
  };

  const handleVarChange = (itemId: string, varName: string, value: string) => {
    setItemVars(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [varName]: value
      }
    }));
  };

  const copyToClipboard = (item: Item) => {
    const text = getSubstitutedContent(item);
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setSearchTerm('');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header className="compact-header">
        <div className="header-left">
          <div className="logo-group">
            <h1>Dev<span className="accent">Cmds</span></h1>
            <div className="logo-badge">v1.2.0</div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${viewMode === 'terminal' ? 'commands' : 'prompts'}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {(searchTerm || selectedTag || selectedCategory !== 'All') && (
              <button className="clear-filters" onClick={resetFilters} title="Clear all filters">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="header-right">
          <div className="view-toggle">
            <button className={`toggle-btn ${viewMode === 'terminal' ? 'active' : ''}`} onClick={() => handleViewToggle('terminal')}>
              <Terminal size={16} /> <span className="hide-mobile">Terminal</span>
            </button>
            <button className={`toggle-btn ${viewMode === 'prompts' ? 'active' : ''}`} onClick={() => handleViewToggle('prompts')}>
              <MessageSquare size={16} /> <span className="hide-mobile">Prompts</span>
            </button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3><Terminal size={14} /> Apps</h3>
            <div className="category-list">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`sidebar-item ${selectedCategory === cat ? 'active' : ''}`} 
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3><Hash size={14} /> Tags</h3>
            <div className="tag-list">
              {allTags.map(tag => (
                <button 
                  key={tag} 
                  className={`sidebar-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="content-area">
          <div className="results-info">
            Showing <strong>{filteredItems.length}</strong> {viewMode === 'terminal' ? 'commands' : 'prompts'}
            {selectedTag && <span> for tag <span className="active-tag-label">#{selectedTag}</span></span>}
            {selectedCategory !== 'All' && <span> in <span className="active-tag-label">{selectedCategory}</span></span>}
          </div>

          <div className="commands-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => {
                const vars = extractVars(item.content);
                return (
                  <div key={item.id} className={`command-card ${viewMode === 'prompts' ? 'prompt-card' : ''}`}>
                    <div className="card-header">
                      <span className="category-badge">
                        {viewMode === 'prompts' && <Sparkles size={12} style={{marginRight: '4px'}} />}
                        {item.category}
                      </span>
                      <div className="tags">
                        {item.tags.map(tag => (
                          <span 
                            key={tag} 
                            className={`tag clickable-tag ${selectedTag === tag ? 'active' : ''}`}
                            onClick={() => handleTagClick(tag)}
                            title={`Filter by #${tag}`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="description">{item.description}</p>
                    
                    {vars.length > 0 && (
                      <div className="variable-inputs">
                        <div className="var-header">
                          <Variable size={14} />
                          <span>Variables</span>
                        </div>
                        <div className="var-grid">
                          {vars.map(v => (
                            <div key={v} className="var-field">
                              <label>{v.toLowerCase().replace(/_/g, ' ')}</label>
                              <input 
                                type="text" 
                                placeholder={v}
                                value={(itemVars[item.id] || {})[v] || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleVarChange(item.id, v, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="command-box">
                      <code className={viewMode === 'prompts' ? 'prompt-text' : ''}>
                        {getSubstitutedContent(item)}
                      </code>
                      <button 
                        className={`copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(item)}
                        title="Copy to clipboard"
                      >
                        {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                {viewMode === 'terminal' ? <Terminal size={48} /> : <MessageSquare size={48} />}
                <p>No results found for your active filters.</p>
                <button className="reset-btn" onClick={resetFilters}>Reset all filters</button>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="compact-footer">
        <div className="footer-content">
          <p>DevCmds &copy; 2026</p>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </footer>

      {copiedId && (
        <div className="toast">
          <Check size={20} />
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default App;