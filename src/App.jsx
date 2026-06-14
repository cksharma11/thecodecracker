import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProblemsList from './components/ProblemsList';
import CodingWorkspace from './components/CodingWorkspace';
import Visualizer from './components/Visualizer';
import SystemDesign from './components/SystemDesign';
import Guides from './components/Guides';
import { useLocalStorage } from './hooks/useLocalStorage';
import { problems } from './data/problems';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State synchronized to localStorage
  const [solvedArray, setSolvedArray] = useLocalStorage('dsa_solved_ids', []);
  const [attemptedArray, setAttemptedArray] = useLocalStorage('dsa_attempted_ids', []);
  const [bookmarksArray, setBookmarksArray] = useLocalStorage('dsa_bookmarks_ids', []);
  const [submissions, setSubmissions] = useLocalStorage('dsa_submissions', []);
  const [savedCodes, setSavedCodes] = useLocalStorage('dsa_code_drafts', {});
  const [savedNotes, setSavedNotes] = useLocalStorage('dsa_notes', {});

  // Convert arrays to Sets for fast O(1) lookups in React renders
  const solvedIds = new Set(solvedArray);
  const attemptedIds = new Set(attemptedArray);
  const bookmarks = new Set(bookmarksArray);

  // Selected coding challenge in the Workspace
  const [selectedProblem, setSelectedProblem] = useState(problems[0]); // Default to Two Sum

  // State update handlers
  const handleSolved = (problemId, language) => {
    const newSolved = new Set(solvedIds);
    newSolved.add(problemId);
    setSolvedArray(Array.from(newSolved));

    // A solved problem is also attempted
    const newAttempted = new Set(attemptedIds);
    newAttempted.add(problemId);
    setAttemptedArray(Array.from(newAttempted));

    // Register a contribution submission for the heatmap
    const newSubmission = {
      problemId,
      language,
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    };
    setSubmissions([...submissions, newSubmission]);
  };

  const handleAttempted = (problemId) => {
    if (!attemptedIds.has(problemId)) {
      const newAttempted = new Set(attemptedIds);
      newAttempted.add(problemId);
      setAttemptedArray(Array.from(newAttempted));
    }
  };

  const toggleBookmark = (problemId) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(problemId)) {
      newBookmarks.delete(problemId);
    } else {
      newBookmarks.add(problemId);
    }
    setBookmarksArray(Array.from(newBookmarks));
  };

  const saveCode = (problemId, language, codeText) => {
    setSavedCodes(prev => ({
      ...prev,
      [problemId]: {
        ...(prev[problemId] || {}),
        [language]: codeText
      }
    }));
  };

  const saveNote = (problemId, noteText) => {
    setSavedNotes(prev => ({
      ...prev,
      [problemId]: noteText
    }));
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            problems={problems}
            solvedIds={solvedIds}
            submissions={submissions}
            setActiveTab={setActiveTab}
            setSelectedProblem={setSelectedProblem}
          />
        );
      case 'problems':
        return (
          <ProblemsList 
            problems={problems}
            solvedIds={solvedIds}
            attemptedIds={attemptedIds}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            setSelectedProblem={setSelectedProblem}
            setActiveTab={setActiveTab}
          />
        );
      case 'roadmap':
        return (
          <Guides 
            problems={problems}
            solvedIds={solvedIds}
            setSelectedProblem={setSelectedProblem}
            setActiveTab={setActiveTab}
          />
        );
      case 'visualizer':
        return <Visualizer />;
      case 'systemdesign':
        return <SystemDesign />;
      case 'workspace':
        return (
          <CodingWorkspace 
            problem={selectedProblem}
            onSolved={handleSolved}
            onAttempted={handleAttempted}
            savedCodes={savedCodes}
            saveCode={saveCode}
            savedNotes={savedNotes}
            saveNote={saveNote}
          />
        );
      default:
        return <div>View not found.</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Background Decorative Glow Accents */}
      <div className="glow-bg" />
      <div className="glow-bg-left" />

      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        solvedCount={solvedIds.size}
        totalCount={problems.length}
      />

      {/* Main Panel Content */}
      <main className="main-content">
        {renderActiveTab()}
      </main>
    </div>
  );
}
