
import { Header } from '@/components/Header';
import { RoadmapGenerator } from '@/components/RoadmapGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      <RoadmapGenerator />
    </div>
  );
};

export default Index;
