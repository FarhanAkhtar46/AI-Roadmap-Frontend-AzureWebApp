import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, GitMerge, List } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Define the structure for a single module
interface Module {
  name: string;
  description?: string;
  time_estimate: string;
  time_estimates?: string;
  prerequisites: string;
  dependencies: string[];
  resources: Resource[];
  objectives?: string[];
}

interface Resource {
  type?: string;
  name?: string;
  platform?: string;
  author?: string;
  url?: string;
}

// Define the props for our component
interface RoadmapProps {
  roadmap: {
    modules: Module[];
  } | null;
}

export const RoadmapVisualization: React.FC<RoadmapProps> = ({ roadmap }) => {
  
  // Gracefully handle cases where there's no data
  if (!roadmap || !Array.isArray(roadmap.modules) || roadmap.modules.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        No roadmap data available to display.
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Your Learning Roadmap</h2>
        <p className="text-lg text-gray-600 mt-2">Here is your tailored plan. Good luck!</p>
      </div>
      
      {roadmap.modules.map((module, index) => {
        // Normalize time_estimate
        const timeEstimate = module.time_estimate || module.time_estimates || '';
        // Normalize resources
        let resources: Resource[] = [];
        if (Array.isArray(module.resources)) {
          if (module.resources.length > 0 && typeof module.resources[0] === 'string') {
            resources = (module.resources as string[]).map((r) => ({ name: r }));
          } else if (module.resources.length > 0 && typeof module.resources[0] === 'object') {
            resources = module.resources as Resource[];
          }
        }
        return (
          <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/50 overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl text-gray-800">{index + 1}. {module.name}</CardTitle>
                <Badge variant="secondary" className="flex items-center space-x-2 py-2 px-4">
                  <Clock className="w-4 h-4" />
                  <span>{timeEstimate}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid gap-4">
              {(module.description || (Array.isArray(module.objectives) && module.objectives.length > 0)) && (
                <div>
                  {module.description && (
                    <p className="text-gray-700 italic mb-2">{module.description}</p>
                  )}
                  {Array.isArray(module.objectives) && module.objectives.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <List className="w-5 h-5 mr-2 text-green-600" />Objectives
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {module.objectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
              {module.prerequisites && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><GitMerge className="w-5 h-5 mr-2 text-purple-600" />Prerequisites</h4>
                  <p className="text-gray-600">{module.prerequisites}</p>
                </div>
              )}
              {resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />Recommended Resources
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {resources
                      .filter((resource) => resource && typeof resource === 'object')
                      .map((resource, rIndex) => (
                        <li key={rIndex}>
                          {resource.url ? (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 underline hover:text-blue-900"
                            >
                              {resource.name || 'Resource'}
                            </a>
                          ) : (
                            <span>{resource.name || 'Resource'}</span>
                          )}
                          {resource.type && (
                            <span className="ml-2 text-xs text-gray-500">({resource.type})</span>
                          )}
                          {resource.platform && (
                            <span className="ml-2 text-xs text-gray-500">[{resource.platform}]</span>
                          )}
                          {resource.author && (
                            <span className="ml-2 text-xs text-gray-500">by {resource.author}</span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500">This roadmap was generated by AI. Please verify critical information.</p>
      </div>
    </div>
  );
};
