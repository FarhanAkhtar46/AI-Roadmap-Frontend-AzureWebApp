import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Lightbulb, Target, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoadmapVisualization } from './RoadmapVisualization';


export const RoadmapGenerator = () => {
  const [conversation, setConversation] = useState<{from: 'user'|'bot', text: string}[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('What domain would you like a roadmap for?');
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [generatedHtmlPath, setGeneratedHtmlPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUserInput, setLastUserInput] = useState<string>('');
  const navigate = useNavigate();

  

  const handleSend = async (inputOverride?: string) => {
    const inputToSend = inputOverride !== undefined ? inputOverride : userInput;
    if (!inputToSend.trim()) return;
    setIsGenerating(true);
    setError(null);
    setLastUserInput(inputToSend);

    setConversation(prev => [...prev, { from: 'user', text: inputToSend }]);

    try {
      const response = await fetch('https://airoadmapgenerator.azurewebsites.net/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: inputToSend }),
      });
      if (!response.ok) {
        throw new Error('Server error');
      }
      const data = await response.json();
      console.log('API response:', data);

      if (typeof data === 'string') {
        setCurrentPrompt(data);
        setConversation(prev => [...prev, { from: 'bot', text: data }]);
        setUserInput('');
      } else if (typeof data === 'object' && data.roadmap) {
        setGeneratedRoadmap(data.roadmap);
        setCurrentPrompt('');
        setConversation([]);
      } else if (typeof data === 'object' && data.html_path) {
        const htmlUrl = `http://localhost:8000/${data.html_path.replace(/\\/g, "/")}`;
        navigate('/roadmap', { state: { htmlUrl } });
      }
      setError(null); // clear error on success
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    handleSend(lastUserInput);
  };

  // Reset conversation both frontend and backend
  const handleResetConversation = async () => {
    try {
      await fetch('http://localhost:8000/api/reset_conversation', { method: 'POST' });
    } catch (e) {
      // Optionally handle error
    }
    setConversation([]);
    setCurrentPrompt('What domain would you like a roadmap for?');
    setUserInput('');
    setGeneratedRoadmap(null);
    setGeneratedHtmlPath(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
               AI 
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600">
              {" "}Roadmap Generator
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Want to make career planning easier? Our AI Roadmap Generator helps you create a 
            custom roadmap in just a few steps. Simply enter your prefer domain details and answer questions, and let AI guide you 
            toward your goals.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex flex-col space-y-4">
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center justify-between">
                  <span>{error}</span>
                  <Button onClick={handleRetry} className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Retry
                  </Button>
                </div>
              )}
              {/* Conversation history */}
              {conversation.length > 0 && (
                <div className="mb-4">
                  {conversation.map((msg, idx) => (
                    <div key={idx} className={msg.from === 'user' ? 'text-right text-blue-700' : 'text-left text-green-700'}>
                      <span className="block px-2 py-1">{msg.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Current prompt/question */}
              {currentPrompt && (
                <div className="relative">
                  <Input
                    placeholder={currentPrompt}
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      setError(null); // clear error on input change
                    }}
                    className="text-lg p-6 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                    disabled={isGenerating}
                  />
                  <Lightbulb className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-6 h-6" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Target className="w-5 h-5" />
                  <span className="text-sm">{conversation.length + 1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleResetConversation}
                    className="bg-red-500 hover:bg-red-600 text-white flex items-center"
                    type="button"
                  >
                    <RefreshCcw className="w-4 h-4 mr-1" />
                    Reset Conversation
                  </Button>
                  <Button
                    onClick={() => handleSend()}
                    disabled={!userInput.trim() || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Send</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {generatedRoadmap && (
          <>
            <pre>{JSON.stringify(generatedRoadmap, null, 2)}</pre>
            <RoadmapVisualization roadmap={generatedRoadmap} />
          </>
        )} */}
        {/* Roadmap Visualization */}
        {generatedRoadmap && (
          <RoadmapVisualization roadmap={generatedRoadmap} />
        )}
        {generatedHtmlPath && (
          <iframe
          src={`${generatedHtmlPath}?${Date.now()}`} // cache-busting
          title="Roadmap Visualization"
          style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '16px', background: 'white' }}
        />
      )}
      </div>
    </div>
  );
};