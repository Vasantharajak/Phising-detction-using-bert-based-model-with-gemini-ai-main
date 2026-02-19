
import React, { useState, useEffect } from 'react';
import { PhishingService } from './services/geminiService';
import { AnalysisResult, PredictionLabel } from './types';
import ShapVisualization from './components/ShapVisualization';
import CyberChatbot from './components/CyberChatbot';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  History, 
  Info, 
  Lock, 
  Cpu, 
  Zap,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const handleAnalyze = async () => {
    if (!inputText.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await PhishingService.analyzeText(inputText);
      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromHistory = (result: AnalysisResult) => {
    setCurrentResult(result);
    setInputText(result.text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Phish<span className="text-indigo-400">Guard</span> AI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Analyzer</a>
            <a href="#" className="hover:text-white transition-colors">How it Works</a>
            <a href="#" className="hover:text-white transition-colors">BERT & SHAP</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              Model Active: BERT-V3
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input and Analysis */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Section */}
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold tracking-widest uppercase">
              <Zap size={14} /> Explainable AI Cybersecurity
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Detect threats with <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Total Transparency.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              PhishGuard uses high-fidelity Transformer architectures (BERT) to classify malicious intent in emails and messages, providing word-level interpretability via SHAP values.
            </p>
          </section>

          {/* Analysis Input Area */}
          <div className="bg-slate-900 rounded-3xl p-1 border border-slate-800 shadow-2xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Search size={16} /> Input Message for Scan
                </label>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setInputText("Urgent: Your account is locked! Click here to verify your identity: http://security-bank-check.com")}
                     className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors"
                   >
                     Sample Phish
                   </button>
                   <button 
                     onClick={() => setInputText("Hi Sarah, just checking in about our meeting tomorrow at 10 AM. Let me know if you're still free.")}
                     className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors"
                   >
                     Sample Safe
                   </button>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the email content or message here..."
                className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-mono text-sm"
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Cpu className="animate-spin" /> Running BERT Classifier & SHAP Explainer...
                  </>
                ) : (
                  <>
                    <Lock size={20} /> Perform Deep Security Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {currentResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-6 rounded-3xl border ${currentResult.label === PredictionLabel.PHISHING ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${currentResult.label === PredictionLabel.PHISHING ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-emerald-500 text-white shadow-emerald-500/50'} shadow-lg`}>
                        {currentResult.label === PredictionLabel.PHISHING ? <ShieldAlert /> : <ShieldCheck />}
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Classification</p>
                        <h4 className="text-2xl font-black">{currentResult.label}</h4>
                      </div>
                   </div>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/50">
                      <BarChart3 />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Model Confidence</p>
                      <h4 className="text-2xl font-black">{Math.round(currentResult.confidence * 100)}%</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explainable AI Layer */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info className="text-indigo-400" />
                    <h3 className="font-bold text-lg">SHAP Interpretability Layer</h3>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">XAI MODULE: BERT-ATTN-MAPS</div>
                </div>
                <div className="p-6 space-y-6">
                  <p className="text-sm text-slate-400">The visualization below represents word-level attribution scores. Words highlighted in <span className="text-red-400 font-bold underline">red</span> indicate high predictive contribution to phishing classification.</p>
                  
                  <ShapVisualization tokens={currentResult.shapTokens} />

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <h5 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
                      Expert Reasoning
                    </h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {currentResult.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Educational Sidebar items shown on small screens or as extra section */}
          <section className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="space-y-4 flex-1">
                  <h3 className="text-3xl font-black">Learn Phishing Prevention</h3>
                  <p className="opacity-90 leading-relaxed">Phishing remains the #1 initial access vector for cyber attacks. Understanding the "Why" behind a detection helps you build a human firewall.</p>
                  <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                    Start Cybersecurity Course <ChevronRight size={20} />
                  </button>
                </div>
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl absolute -right-10 -top-10 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                   <Lock size={64} className="opacity-50" />
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Chatbot and History */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="sticky top-24 space-y-8">
            {/* Cybersecurity Chatbot */}
            <CyberChatbot currentContext={currentResult} />

            {/* History Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
               <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center gap-2">
                 <History className="text-slate-400 w-5 h-5" />
                 <h3 className="font-semibold text-sm uppercase tracking-wider">Analysis History</h3>
               </div>
               <div className="max-h-[300px] overflow-y-auto">
                 {history.length === 0 ? (
                   <div className="p-8 text-center text-slate-500 text-sm italic">
                     No scan history yet.
                   </div>
                 ) : (
                   <div className="divide-y divide-slate-800">
                     {history.map((item) => (
                       <button
                         key={item.id}
                         onClick={() => loadFromHistory(item)}
                         className="w-full p-4 text-left hover:bg-slate-800 transition-colors group flex items-start gap-3"
                       >
                         <div className={`mt-1 p-1.5 rounded ${item.label === PredictionLabel.PHISHING ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                           {item.label === PredictionLabel.PHISHING ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-slate-300 truncate group-hover:text-indigo-400 transition-colors">
                             {item.text}
                           </p>
                           <div className="flex items-center justify-between mt-1">
                             <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                             <span className="text-[10px] font-mono text-slate-600">{Math.round(item.confidence * 100)}% Conf.</span>
                           </div>
                         </div>
                       </button>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            {/* Tech Specs */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">System Architecture</h4>
               <ul className="space-y-3">
                 <li className="flex items-center gap-2 text-xs">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                   <span className="text-slate-400">Model:</span>
                   <span className="font-mono">bert-base-uncased-v3</span>
                 </li>
                 <li className="flex items-center gap-2 text-xs">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                   <span className="text-slate-400">Explainer:</span>
                   <span className="font-mono">SHAP (KernelExplainer)</span>
                 </li>
                 <li className="flex items-center gap-2 text-xs">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                   <span className="text-slate-400">Inference:</span>
                   <span className="font-mono">Real-time Stream</span>
                 </li>
                 <li className="flex items-center gap-2 text-xs">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                   <span className="text-slate-400">Training:</span>
                   <span className="font-mono">PhishCorpus 2024 (12M samples)</span>
                 </li>
               </ul>
               <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                 <span>API Status: Healthy</span>
                 <a href="#" className="flex items-center gap-1 hover:text-indigo-400">Docs <ExternalLink size={10} /></a>
               </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-800 mt-20 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              <span className="font-bold">PhishGuard AI</span>
            </div>
            <p className="text-slate-500 text-xs">Empowering humans with explainable cybersecurity intelligence.</p>
          </div>
          <div className="flex gap-8 text-xs font-medium text-slate-500">
             <a href="#" className="hover:text-slate-300">Privacy Policy</a>
             <a href="#" className="hover:text-slate-300">Terms of Service</a>
             <a href="#" className="hover:text-slate-300">Research Paper</a>
             <a href="#" className="hover:text-slate-300">Github</a>
          </div>
          <p className="text-slate-600 text-[10px]">© 2024 Explainable AI (XAI) Labs. Built for Cyber-Defense.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
