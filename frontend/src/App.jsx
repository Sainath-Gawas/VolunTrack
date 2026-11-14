import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import OpportunitiesListing from './pages/OpportunitiesListing';
import OpportunityDetail from './pages/OpportunityDetail';
import AddOpportunity from './pages/AddOpportunity';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/opportunities" element={<OpportunitiesListing />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/opportunities/:id/edit" element={<AddOpportunity />} />
          <Route path="/add" element={<AddOpportunity />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;