import React, { useState } from "react";
import { Leaf, Download } from "lucide-react";
import { exportPDF } from "../../utils/utils";
const Header = ({ targetLevel, scores, selections, totalProjected }) => {
    const [scenarioName, setScenarioName] = useState("New Project Scenario");

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-600 p-2 rounded-lg text-white">
                            <Leaf size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">
                                IGBC Feasibility Tool
                            </h1>
                            <h1 className="text-xl font-bold text-slate-900 sm:hidden">
                                IGBC Tool
                            </h1>
                            <p className="text-xs text-slate-500 hidden sm:block">
                                Green Homes Certification Calculator
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Scenario Name Input */}
                        <input
                            type="text"
                            value={scenarioName}
                            onChange={(e) => setScenarioName(e.target.value)}
                            className="hidden md:block border-b border-transparent hover:border-slate-300 focus:border-green-500 focus:outline-none bg-transparent text-sm px-2 py-1 transition-colors"
                            title="Edit Scenario Name"
                        />

                        <button
                            onClick={() =>
                                exportPDF(
                                    scenarioName,
                                    targetLevel,
                                    scores,
                                    selections,
                                    totalProjected,
                                )
                            }
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
