import React, { useState } from 'react';
import './App.css';

function App() {
  const [resume, setResume] = useState({
    name: '',
    experience: [{ role: '', company: '' }],
    education: [{ degree: '', university: '' }],
    skills: [],
  });
  const [file, setFile] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancePreview, setEnhancePreview] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      alert(`File ${uploadedFile.name} uploaded successfully (parsing would happen in real implementation)`);
    }
  };

  const handleInputChange = (section, index, field, value) => {
    const updatedResume = { ...resume };
    updatedResume[section][index][field] = value;
    setResume(updatedResume);
  };

  const addSectionEntry = (section) => {
    const updatedResume = { ...resume };
    updatedResume[section].push(section === 'skills' ? '' : {});
    setResume(updatedResume);
  };

  const removeSectionEntry = (section, index) => {
    const updatedResume = { ...resume };
    updatedResume[section].splice(index, 1);
    setResume(updatedResume);
  };

  const enhanceWithAI = async (section, index) => {
    setIsEnhancing(true);
    try {
      let content;
      if (section === 'skills') {
        content = resume.skills[index];
      } else {
        content = resume[section][index];
      }

      const response = await fetch('http://localhost:8000/ai-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: section,
          content: content
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setEnhancePreview({
        section,
        index,
        content: result.enhanced_content
      });
      
    } catch (error) {
      console.error('AI Enhancement failed:', error);
      alert('Failed to enhance section. Check console for details.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const applyEnhancement = () => {
    if (!enhancePreview) return;

    const { section, index, content } = enhancePreview;
    const updatedResume = { ...resume };

    if (section === 'skills') {
      updatedResume.skills[index] = content;
    } else {
      // Merge enhanced content with existing fields
      updatedResume[section][index] = {
        ...updatedResume[section][index],
        ...content
      };
    }

    setResume(updatedResume);
    setEnhancePreview(null);
  };

  const saveResume = async () => {
    try {
      const response = await fetch('http://localhost:8000/save-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(`Resume saved successfully! ${result.message}`);
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume. Check console for details.');
    }
  };

  const downloadResume = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
  };

  return (
    <div className="App">
      <h1>Resume Editor</h1>
      
      {/* File Upload */}
      <div className="section">
        <h2>Upload Resume</h2>
        <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} />
      </div>

      {/* Name */}
      <div className="section">
        <h2>Personal Information</h2>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={resume.name}
            onChange={(e) => setResume({ ...resume, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
      </div>

      {/* Experience */}
      <div className="section">
        <h2>Work Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="entry">
            <div className="form-group">
              <label>Job Title:</label>
              <input
                value={exp.role || ''}
                onChange={(e) => handleInputChange('experience', index, 'role', e.target.value)}
                placeholder="Software Developer"
              />
            </div>
            <div className="form-group">
              <label>Company:</label>
              <input
                value={exp.company || ''}
                onChange={(e) => handleInputChange('experience', index, 'company', e.target.value)}
                placeholder="Tech Inc."
              />
            </div>
            {exp.description && (
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => handleInputChange('experience', index, 'description', e.target.value)}
                />
              </div>
            )}
            <div className="actions">
              <button 
                onClick={() => enhanceWithAI('experience', index)}
                disabled={isEnhancing}
              >
                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
              </button>
              <button 
                className="remove-btn"
                onClick={() => removeSectionEntry('experience', index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => addSectionEntry('experience')}>
          + Add Experience
        </button>
      </div>

      {/* Education */}
      <div className="section">
        <h2>Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="entry">
            <div className="form-group">
              <label>Degree:</label>
              <input
                value={edu.degree || ''}
                onChange={(e) => handleInputChange('education', index, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            <div className="form-group">
              <label>University:</label>
              <input
                value={edu.university || ''}
                onChange={(e) => handleInputChange('education', index, 'university', e.target.value)}
                placeholder="University of Technology"
              />
            </div>
            <div className="actions">
              <button 
                onClick={() => enhanceWithAI('education', index)}
                disabled={isEnhancing}
              >
                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
              </button>
              <button 
                className="remove-btn"
                onClick={() => removeSectionEntry('education', index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => addSectionEntry('education')}>
          + Add Education
        </button>
      </div>

      {/* Skills */}
      <div className="section">
        <h2>Skills</h2>
        {resume.skills.map((skill, index) => (
          <div key={index} className="entry">
            <div className="form-group">
              <input
                value={skill || ''}
                onChange={(e) => {
                  const updatedSkills = [...resume.skills];
                  updatedSkills[index] = e.target.value;
                  setResume({ ...resume, skills: updatedSkills });
                }}
                placeholder="JavaScript, Python, etc."
              />
            </div>
            <div className="actions">
              <button 
                onClick={() => enhanceWithAI('skills', index)}
                disabled={isEnhancing}
              >
                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
              </button>
              <button 
                className="remove-btn"
                onClick={() => removeSectionEntry('skills', index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => addSectionEntry('skills')}>
          + Add Skill
        </button>
      </div>

      {/* Enhance Preview Modal */}
      {enhancePreview && (
        <div className="modal">
          <div className="modal-content">
            <h3>AI Enhancement Preview</h3>
            <pre>{JSON.stringify(enhancePreview.content, null, 2)}</pre>
            <div className="modal-actions">
              <button onClick={applyEnhancement}>Apply Enhancement</button>
              <button onClick={() => setEnhancePreview(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Save & Download */}
      <div className="section actions">
        <button onClick={saveResume} className="primary">
          Save Resume
        </button>
        <button onClick={downloadResume} className="secondary">
          Download JSON
        </button>
      </div>
    </div>
  );
}

export default App;