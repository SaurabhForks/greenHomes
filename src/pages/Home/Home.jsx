import React, { useState } from 'react';
import {
    CheckCircle,
    HelpCircle,
    XCircle,
    ChevronRight,
    Info
} from 'lucide-react';
import { CATEGORIES } from '../../utils/data';
import Header from '../../components/Header/Header';

// --- DATA CONSTANTS ---



const CERTIFICATION_LEVELS = {
    'Certified': { min: 40, max: 49, color: 'text-green-600' },
    'Silver': { min: 50, max: 59, color: 'text-gray-400' },
    'Gold': { min: 60, max: 79, color: 'text-yellow-500' },
    'Platinum': { min: 80, max: 100, color: 'text-blue-500' },
};

// --- COMPONENTS ---

export default function IGBCFeasibilityTool() {
    const [activeTab, setActiveTab] = useState(0);
    const [targetLevel, setTargetLevel] = useState('Gold');
    const [selections, setSelections] = useState({}); // { creditId: { status: 'yes'|'maybe'|'no', notes: '' } }
    //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    // Initialize selections state if needed, though dynamic is fine
    // Calculating scores
    const scores = Object.values(selections).reduce((acc, curr) => {
        // Find the credit to get points
        let points = 0;
        CATEGORIES.forEach(cat => {
            const credit = cat.credits.find(c => c.id === curr.creditId);
            if (credit) points = credit.points;
        });

        if (curr.status === 'yes') acc.yes += points;
        if (curr.status === 'maybe') acc.maybe += points;
        return acc;
    }, { yes: 0, maybe: 0 });

    const totalProjected = scores.yes + scores.maybe;

    const handleSelection = (creditId, status) => {
        setSelections(prev => ({
            ...prev,
            [creditId]: { ...prev[creditId], status, creditId }
        }));
    };

    const handleNoteChange = (creditId, note) => {
        setSelections(prev => ({
            ...prev,
            [creditId]: { ...prev[creditId], notes: note, creditId }
        }));
    };

    // PDF Export Logic


    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

            <Header targetLevel={targetLevel} scores={scores} selections={selections} totalProjected={totalProjected} />
            {/* --- DASHBOARD SCORECARD --- */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                        {/* Target Selector */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                Target Certification
                            </label>
                            <div className="flex items-center justify-between">
                                <select
                                    value={targetLevel}
                                    onChange={(e) => setTargetLevel(e.target.value)}
                                    className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 font-medium"
                                >
                                    {Object.keys(CERTIFICATION_LEVELS).map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                <div className={`ml-4 text-2xl font-bold ${CERTIFICATION_LEVELS[targetLevel].color}`}>
                                    {CERTIFICATION_LEVELS[targetLevel].min}+
                                </div>
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-medium text-slate-700">Projected Score</span>
                                <span className="text-2xl font-bold text-slate-900">
                                    {totalProjected} <span className="text-base text-slate-400 font-normal">/ 100</span>
                                </span>
                            </div>

                            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                                {/* Yes Score */}
                                <div
                                    className="h-full bg-green-500 transition-all duration-500"
                                    style={{ width: `${scores.yes}%` }}
                                    title={`Secured: ${scores.yes}`}
                                />
                                {/* Maybe Score */}
                                <div
                                    className="h-full bg-yellow-400 striped-bar transition-all duration-500"
                                    style={{ width: `${scores.maybe}%` }}
                                    title={`Potential: ${scores.maybe}`}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span>Secured: <strong>{scores.yes}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                    <span>Potential: <strong>{scores.maybe}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                                    <span>Missing: <strong>{100 - totalProjected}</strong></span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDE NAVIGATION (TABS) --- */}
                    <nav className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-1">
                            {CATEGORIES.map((cat, idx) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === idx
                                        ? 'bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={activeTab === idx ? 'text-green-600' : 'text-slate-400'}>
                                            {cat.icon}
                                        </span>
                                        <span>{cat.shortName}</span>
                                    </div>
                                    {activeTab === idx && <ChevronRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* --- MAIN CONTENT AREA --- */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                            {/* Category Header */}
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        {CATEGORIES[activeTab].name}
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Maximum Available Points: <span className="font-semibold text-slate-700">{CATEGORIES[activeTab].totalPoints}</span>
                                    </p>
                                </div>
                                <div className="text-slate-300">
                                    {CATEGORIES[activeTab].icon}
                                </div>
                            </div>

                            {/* Credits List */}
                            <div className="divide-y divide-slate-100">
                                {CATEGORIES[activeTab].credits.map((credit) => {
                                    const selection = selections[credit.id] || { status: 'none', notes: '' };
                                    const isMandatory = credit.mandatory;

                                    return (
                                        <div key={credit.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors group">
                                            <div className="flex flex-col md:flex-row md:items-start gap-4">

                                                {/* Credit Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {isMandatory && (
                                                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                Required
                                                            </span>
                                                        )}
                                                        <h3 className="text-sm font-semibold text-slate-800">
                                                            {credit.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        Credit ID: {credit.id.toUpperCase()}
                                                    </p>
                                                </div>

                                                {/* Points Badge */}
                                                <div className="flex-shrink-0 md:text-right w-16">
                                                    <span className={`text-sm font-bold ${selection.status === 'yes' ? 'text-green-600' : 'text-slate-400'}`}>
                                                        {isMandatory ? 'Req' : `${credit.points} pts`}
                                                    </span>
                                                </div>

                                                {/* Controls */}
                                                <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[280px]">

                                                    {/* Toggles */}
                                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                                        <button
                                                            onClick={() => handleSelection(credit.id, 'yes')}
                                                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${selection.status === 'yes'
                                                                ? 'bg-white text-green-700 shadow-sm'
                                                                : 'text-slate-500 hover:text-slate-700'
                                                                }`}
                                                        >
                                                            <CheckCircle size={14} /> Yes
                                                        </button>
                                                        <button
                                                            onClick={() => handleSelection(credit.id, 'maybe')}
                                                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${selection.status === 'maybe'
                                                                ? 'bg-white text-yellow-600 shadow-sm'
                                                                : 'text-slate-500 hover:text-slate-700'
                                                                }`}
                                                        >
                                                            <HelpCircle size={14} /> Maybe
                                                        </button>
                                                        <button
                                                            onClick={() => handleSelection(credit.id, 'no')}
                                                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${selection.status === 'no'
                                                                ? 'bg-white text-red-600 shadow-sm'
                                                                : 'text-slate-500 hover:text-slate-700'
                                                                }`}
                                                        >
                                                            <XCircle size={14} /> No
                                                        </button>
                                                    </div>

                                                    {/* Notes Input */}
                                                    <input
                                                        type="text"
                                                        placeholder="Add notes here..."
                                                        value={selection.notes || ''}
                                                        onChange={(e) => handleNoteChange(credit.id, e.target.value)}
                                                        className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        {/* Helper Info */}
                        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
                            <Info className="flex-shrink-0 w-5 h-5" />
                            <p>
                                <strong>Pro Tip:</strong> Use the "Maybe" category for credits where design documentation is pending or simulation results are not yet final. These points count towards your potential score but help you identify risk areas.
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            <style>{`
        .striped-bar {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
          );
          background-size: 1rem 1rem;
        }
      `}</style>
        </div>
    );
}