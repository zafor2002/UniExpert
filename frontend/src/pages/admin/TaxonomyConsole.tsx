import React, { useState } from 'react';
import { 
  GitBranch, RefreshCw, AlertTriangle, CheckCircle2, ChevronRight, 
  ChevronDown, Plus, Trash2, Edit3, Merge 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const TaxonomyConsole: React.FC = () => {
  const [reindexing, setReindexing] = useState(false);
  const [reindexProgress, setReindexProgress] = useState(0);

  const [customTags, setCustomTags] = useState([
    { id: 'tag-1', name: 'TinyML-CMSIS-NN', requestedBy: 'Abu Zafor', count: 4 },
    { id: 'tag-2', name: 'scRNAseq-Seurat', requestedBy: 'Anamul Haque', count: 2 },
  ]);

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    embedded: true,
    tinyml: true,
    bio: true,
  });

  const toggleNode = (node: string) => {
    setExpandedNodes({ ...expandedNodes, [node]: !expandedNodes[node] });
  };

  const handleReindex = () => {
    setReindexing(true);
    setReindexProgress(15);
    const interval = setInterval(() => {
      setReindexProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setReindexing(false);
          toast.success('Academic embeddings re-indexed. 847 vectors updated.');
          return 100;
        }
        return p + 25;
      });
    }, 600);
  };

  const handleApproveTag = (id: string, name: string) => {
    toast.success(`Tag "${name}" approved into canonical academic taxonomy.`);
    setCustomTags(customTags.filter((t) => t.id !== id));
  };

  const handleMergeTag = (id: string, name: string) => {
    toast.success(`Tag "${name}" merged into canonical domain node.`);
    setCustomTags(customTags.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#2563EB] border border-[#8AB4F8]/30">
              Ontology Governance
            </span>
            <span className="text-xs text-[#64748B]">· Academic Taxonomy & Entity Graphs</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#334155]">Taxonomy & Moderation Console</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Maintain hierarchical domain taxonomy, resolve circular dependencies, and refresh Qdrant embeddings
          </p>
        </div>

        {/* Re-index button */}
        <div>
          <button
            onClick={handleReindex}
            disabled={reindexing}
            className="btn-primary text-xs px-5 py-2.5 font-semibold flex items-center gap-2 shadow-sm"
          >
            <RefreshCw size={14} className={reindexing ? 'animate-spin' : ''} />
            {reindexing ? `Re-Indexing (${reindexProgress}%)` : 'Re-Index Academic Embeddings'}
          </button>
        </div>
      </div>

      {/* Re-indexing progress bar */}
      {reindexing && (
        <div className="card p-4 space-y-2 border border-[#8AB4F8]/50 bg-[#EAF2FF] rounded-2xl shadow-sm">
          <div className="flex justify-between text-xs font-semibold text-[#334155]">
            <span>Updating Qdrant HNSW vector spaces (384-dim FastEmbed)...</span>
            <span>{reindexProgress}%</span>
          </div>
          <div className="w-full bg-white/80 border border-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div className="bg-[#8AB4F8] h-full transition-all duration-300" style={{ width: `${reindexProgress}%` }} />
          </div>
        </div>
      )}

      {/* Cycle Detection Error Box */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
        <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-rose-900 leading-relaxed">
          <span className="font-bold block mb-0.5">Taxonomy Validation Error:</span>
          Circular dependency detected between domain nodes: <code className="bg-rose-100/70 text-rose-800 px-1 py-0.5 rounded font-mono">[Natural Language Processing] → [Machine Learning] → [NLP Transformer Architectures] → [Natural Language Processing]</code>. Vector graph cycles prevent topological DAG sorting.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hierarchical Domain Tree */}
        <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#334155] flex items-center gap-2">
              <GitBranch size={18} className="text-[#8AB4F8]" />
              Hierarchical Domain Tree (DAG)
            </h2>
            <button
              onClick={() => toast.success('New root domain node modal opened')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] border border-[#E2E8F0] flex items-center gap-1 transition-colors"
            >
              <Plus size={13} /> Add Node
            </button>
          </div>

          <div className="space-y-1 font-mono text-xs border border-[#E2E8F0] rounded-2xl p-4 bg-[#F4F8FF]/60">
            {/* Level 1: Embedded Systems */}
            <div>
              <div
                onClick={() => toggleNode('embedded')}
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-[#EAF2FF] rounded-lg cursor-pointer font-bold text-[#334155] transition-colors"
              >
                {expandedNodes['embedded'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>Embedded & Cyber-Physical Systems</span>
                <span className="text-[10px] text-[#64748B] font-normal">(42 Experts)</span>
              </div>

              {expandedNodes['embedded'] && (
                <div className="pl-6 space-y-1 border-l-2 border-[#E2E8F0] ml-3 mt-1">
                  <div
                    onClick={() => toggleNode('tinyml')}
                    className="flex items-center gap-2 py-1 px-2 hover:bg-[#EAF2FF] rounded-lg cursor-pointer font-semibold text-[#2563EB] transition-colors"
                  >
                    {expandedNodes['tinyml'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span>TinyML & Edge AI</span>
                  </div>

                  {expandedNodes['tinyml'] && (
                    <div className="pl-6 space-y-1 text-[#64748B]">
                      <div className="py-0.5 px-2 hover:bg-[#EAF2FF] rounded transition-colors">
                        • ARM Cortex-M4 CMSIS-NN Optimization
                      </div>
                      <div className="py-0.5 px-2 hover:bg-[#EAF2FF] rounded transition-colors">
                        • Quantized 8-Bit CNN Inference
                      </div>
                      <div className="py-0.5 px-2 hover:bg-[#EAF2FF] rounded transition-colors">
                        • BLE 5.0 Mesh & GATT Architecture
                      </div>
                    </div>
                  )}

                  <div className="py-1 px-2 hover:bg-[#EAF2FF] rounded-lg font-semibold text-[#334155] transition-colors">
                    • IEC 62304 Medical Device Safety
                  </div>
                </div>
              )}
            </div>

            {/* Level 1: Bioinformatics */}
            <div className="pt-2">
              <div
                onClick={() => toggleNode('bio')}
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-[#EAF2FF] rounded-lg cursor-pointer font-bold text-[#334155] transition-colors"
              >
                {expandedNodes['bio'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>Bioinformatics & Genomics</span>
                <span className="text-[10px] text-[#64748B] font-normal">(18 Experts)</span>
              </div>

              {expandedNodes['bio'] && (
                <div className="pl-6 space-y-1 border-l-2 border-[#E2E8F0] ml-3 mt-1 text-[#64748B]">
                  <div className="py-0.5 px-2 hover:bg-[#EAF2FF] rounded transition-colors">
                    • scRNA-seq Analysis Pipelines
                  </div>
                  <div className="py-0.5 px-2 hover:bg-[#EAF2FF] rounded transition-colors">
                    • GNN Drug-Target Interaction
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Tag Moderation Queue */}
        <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl">
          <h2 className="text-base font-bold text-[#334155]">
            User-Generated Custom Tag Moderation Queue
          </h2>
          <p className="text-xs text-[#64748B]">
            Tags requested by students or faculty during capstone problem formulation
          </p>

          <div className="space-y-3">
            {customTags.map((tag) => (
              <div
                key={tag.id}
                className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF]/50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#334155] block">
                    #{tag.name}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    Proposed by {tag.requestedBy} · Used in {tag.count} proposals
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMergeTag(tag.id, tag.name)}
                    className="px-3 py-1 rounded-xl text-[11px] font-semibold text-[#334155] bg-[#F4F8FF] hover:bg-[#EAF2FF] border border-[#E2E8F0] flex items-center gap-1 transition-colors"
                  >
                    <Merge size={12} /> Merge
                  </button>
                  <button
                    onClick={() => handleApproveTag(tag.id, tag.name)}
                    className="btn-primary text-[11px] py-1 px-3 font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 size={12} /> Approve
                  </button>
                </div>
              </div>
            ))}

            {customTags.length === 0 && (
              <div className="p-8 text-center text-xs text-[#64748B]">
                All custom tags processed and merged into canonical ontology.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyConsole;

