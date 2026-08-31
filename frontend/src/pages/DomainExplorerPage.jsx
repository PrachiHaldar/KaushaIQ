import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Layers, Search, ArrowRight, BookOpen, Briefcase, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import { Link } from 'react-router-dom';

export default function DomainExplorerPage() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedDomainDetails, setSelectedDomainDetails] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await api.get('/domains');
        if (res.success) setDomains(res.data);
      } catch (err) {
        console.error('Failed to load domains:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  const handleSelectDomain = async (dom) => {
    setSelectedDomain(dom);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/domains/${dom.slug}`);
      if (res.success) {
        setSelectedDomainDetails(res.data);
      }
    } catch (e) {
      console.error('Failed to load domain details:', e);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredDomains = domains.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-2">
            <Layers className="w-3.5 h-3.5" />
            Universal Taxonomy Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Every Domain. One Platform.</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explore 16+ academic disciplines mapped with universal skill categories, industry career benchmarks, curated modules, and real-time opportunities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domain (e.g. AI, Biotech, Law)..."
            className="glass-input text-xs w-full pl-10 py-2.5"
          />
        </div>
      </div>

      {/* Grid of Domains */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="glass-panel p-6 h-48 animate-pulse bg-slate-900/50"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredDomains.map((dom) => (
            <div
              key={dom.id}
              onClick={() => handleSelectDomain(dom)}
              className="glass-panel p-6 hover:border-brand-500/50 hover:shadow-brand-500/10 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-300 border border-brand-500/30">
                    {dom.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {dom._count?.skills || 0} Universal Skills
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-brand-300 transition-colors">
                  {dom.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {dom.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-brand-400 font-semibold group-hover:text-brand-300">
                <span>Explore Ecosystem</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Domain Details Modal */}
      {selectedDomain && (
        <Modal
          isOpen={!!selectedDomain}
          onClose={() => {
            setSelectedDomain(null);
            setSelectedDomainDetails(null);
          }}
          title={`${selectedDomain.name} (${selectedDomain.code}) Ecosystem`}
          maxWidth="max-w-3xl"
        >
          {detailsLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
              Loading domain taxonomy and real-time database mappings...
            </div>
          ) : selectedDomainDetails ? (
            <div className="space-y-6 text-xs text-slate-300">
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedDomainDetails.description}
              </p>

              {/* Skills Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  Universal Skill Competencies ({selectedDomainDetails.skills?.length || 0}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDomainDetails.skills?.map((sk) => (
                    <div key={sk.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">{sk.name}</span>
                        <span className="text-[10px] text-slate-400">{sk.category?.name || 'Technical'}</span>
                      </div>
                      <span className="badge-assessed text-[10px]">Req: {sk.requiredLevel}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Paths */}
              {selectedDomainDetails.careerPaths?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    Target Career Pathways ({selectedDomainDetails.careerPaths.length}):
                  </h4>
                  <div className="space-y-2">
                    {selectedDomainDetails.careerPaths.map((cp) => (
                      <div key={cp.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{cp.name}</span>
                          <span className="text-emerald-400 font-semibold text-[11px]">{cp.averageSalary}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{cp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Hub Links */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <Link
                  to={`/learning?domainId=${selectedDomain.id}`}
                  className="glass-button-secondary text-xs px-4 py-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                  View Learning Modules
                </Link>
                <Link
                  to={`/opportunities?domainId=${selectedDomain.id}`}
                  className="glass-button-primary text-xs px-4 py-2"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Explore Matching Opportunities
                </Link>
              </div>
            </div>
          ) : null}
        </Modal>
      )}
    </div>
  );
}
