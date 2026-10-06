"use client";

import React, { useState, useRef } from "react";
import Papa from "papaparse";
export interface NexusRule {
  state: string;
  salesThreshold: number;
  transactionThreshold: number | null;
  ruleType: "both" | "either" | "sales_only";
  notes?: string;
}

export const US_NEXUS_RULES: Record<string, NexusRule> = {
  AL: { state: "Alabama", salesThreshold: 250000, transactionThreshold: null, ruleType: "sales_only" },
  AK: { state: "Alaska", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  AZ: { state: "Arizona", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  AR: { state: "Arkansas", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  CA: { state: "California", salesThreshold: 500000, transactionThreshold: null, ruleType: "sales_only" },
  CO: { state: "Colorado", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  CT: { state: "Connecticut", salesThreshold: 100000, transactionThreshold: 200, ruleType: "both" },
  DE: { state: "Delaware", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  FL: { state: "Florida", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  GA: { state: "Georgia", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  HI: { state: "Hawaii", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ID: { state: "Idaho", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  IL: { state: "Illinois", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  IN: { state: "Indiana", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  IA: { state: "Iowa", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  KS: { state: "Kansas", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  KY: { state: "Kentucky", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  LA: { state: "Louisiana", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ME: { state: "Maine", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MD: { state: "Maryland", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MA: { state: "Massachusetts", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MI: { state: "Michigan", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MN: { state: "Minnesota", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MS: { state: "Mississippi", salesThreshold: 250000, transactionThreshold: null, ruleType: "sales_only" },
  MO: { state: "Missouri", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MT: { state: "Montana", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  NE: { state: "Nebraska", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NV: { state: "Nevada", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NH: { state: "New Hampshire", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  NJ: { state: "New Jersey", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NM: { state: "New Mexico", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  NY: { state: "New York", salesThreshold: 500000, transactionThreshold: 100, ruleType: "both" },
  NC: { state: "North Carolina", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ND: { state: "North Dakota", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  OH: { state: "Ohio", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  OK: { state: "Oklahoma", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  OR: { state: "Oregon", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  PA: { state: "Pennsylvania", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  RI: { state: "Rhode Island", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  SC: { state: "South Carolina", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  SD: { state: "South Dakota", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  TN: { state: "Tennessee", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  TX: { state: "Texas", salesThreshold: 500000, transactionThreshold: null, ruleType: "sales_only" },
  UT: { state: "Utah", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  VT: { state: "Vermont", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  VA: { state: "Virginia", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  WA: { state: "Washington", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  WV: { state: "West Virginia", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  WI: { state: "Wisconsin", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  WY: { state: "Wyoming", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" }
};
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  UploadCloud,
  ArrowUpRight,
  Download,
  Mail,
  Lock,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SalesSummary {
  state: string;
  code: string;
  totalSales: number;
  totalOrders: number;
  revenueThreshold: number;
  transactionThreshold: number | null;
  revenueProgress: number;
  transactionProgress: number;
  status: "safe" | "warning" | "exceeded";
}

export default function Home() {
  const [data, setData] = useState<SalesSummary[]>([]);
  const [filter, setFilter] = useState<"all" | "action_needed" | "safe">("all");
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    exceededStates: 0,
    warningStates: 0,
  });

  const [userEmail, setUserEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processCSV(results.data as any[]);
      },
    });
  };

  const processCSV = (rows: any[]) => {
    const stateMap: Record<string, { totalSales: number; totalOrders: number }> = {};

    rows.forEach((row) => {
      const state =
        row["Shipping Province"] ||
        row["Shipping State"] ||
        row["State"] ||
        row["Province"] ||
        row["billing_state"] ||
        "";

      const salesRaw =
        row["Total Sales"] ||
        row["Total"] ||
        row["Amount"] ||
        row["total_price"] ||
        "0";

      const cleanedState = String(state).trim().toUpperCase();
      const cleanedAmount = parseFloat(String(salesRaw).replace(/[^0-9.-]+/g, "")) || 0;

      if (!cleanedState) return;

      if (!stateMap[cleanedState]) {
        stateMap[cleanedState] = { totalSales: 0, totalOrders: 0 };
      }

      stateMap[cleanedState].totalSales += cleanedAmount;
      stateMap[cleanedState].totalOrders += 1;
    });

    let cumulativeSales = 0;
    let cumulativeOrders = 0;
    let exceededCount = 0;
    let warningCount = 0;

    const analyzed: SalesSummary[] = US_NEXUS_RULES.map((rule) => {
      const userStateData =
        stateMap[rule.code.toUpperCase()] ||
        stateMap[rule.state.toUpperCase()] || { totalSales: 0, totalOrders: 0 };

      cumulativeSales += userStateData.totalSales;
      cumulativeOrders += userStateData.totalOrders;

      const revProgress =
        rule.revenueThreshold > 0
          ? Math.min((userStateData.totalSales / rule.revenueThreshold) * 100, 100)
          : 0;

      const txProgress = rule.transactionThreshold
        ? Math.min((userStateData.totalOrders / rule.transactionThreshold) * 100, 100)
        : 0;

      let status: "safe" | "warning" | "exceeded" = "safe";

      if (
        (rule.revenueThreshold > 0 && userStateData.totalSales >= rule.revenueThreshold) ||
        (rule.transactionThreshold && userStateData.totalOrders >= rule.transactionThreshold)
      ) {
        status = "exceeded";
        exceededCount++;
      } else if (revProgress >= 80 || txProgress >= 80) {
        status = "warning";
        warningCount++;
      }

      return {
        state: rule.state,
        code: rule.code,
        totalSales: userStateData.totalSales,
        totalOrders: userStateData.totalOrders,
        revenueThreshold: rule.revenueThreshold,
        transactionThreshold: rule.transactionThreshold,
        revenueProgress: revProgress,
        transactionProgress: txProgress,
        status,
      };
    });

    analyzed.sort((a, b) => {
      const priority = { exceeded: 2, warning: 1, safe: 0 };
      if (priority[b.status] !== priority[a.status]) {
        return priority[b.status] - priority[a.status];
      }
      return b.totalSales - a.totalSales;
    });

    setData(analyzed);
    setSummaryMetrics({
      totalSales: cumulativeSales,
      totalOrders: cumulativeOrders,
      exceededStates: exceededCount,
      warningStates: warningCount,
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;
    setIsUnlocked(true);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("US-Nexus-Audit-Report.pdf");
    } catch (err) {
      console.error(err);
    }
    setIsDownloading(false);
  };

  const filteredData = data.filter((item) => {
    if (filter === "action_needed") return item.status === "exceeded" || item.status === "warning";
    if (filter === "safe") return item.status === "safe";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-500/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-black tracking-tight text-white">Nexus<span className="text-indigo-400">Guard</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                Audit Tool
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">Free Tier</span>
            <button className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200">
              Auto Sync ($15/mo)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> 
            <span>Updated with 2026 US Wayfair Nexus Rules</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Stop guessing sales tax. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Track economic nexus in seconds.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Upload your sales exports from Shopify, Stripe, or Etsy. We calculate revenue and transaction volume across all 50 US states to identify registration liabilities.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="max-w-2xl mx-auto">
          <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl p-10 bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-xl shadow-black/20">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition duration-300 text-indigo-400 mb-3 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <span className="font-semibold text-base text-slate-200 group-hover:text-white">
              Drop your order export CSV here
            </span>
            <span className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" /> Supports Shopify, Etsy, WooCommerce & Stripe
            </span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Results View */}
        {data.length > 0 && (
          <div ref={reportRef} className="space-y-8 animate-in fade-in duration-500">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Total Evaluated Sales</span>
                  <DollarSign className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2 text-white">${summaryMetrics.totalSales.toLocaleString()}</p>
                <div className="text-[11px] text-slate-500 mt-1">Sum of all transaction amounts</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Total Order Volume</span>
                  <ShoppingCart className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2 text-white">{summaryMetrics.totalOrders.toLocaleString()}</p>
                <div className="text-[11px] text-slate-500 mt-1">Processed transactions</div>
              </div>

              <div className="bg-gradient-to-b from-rose-950/40 to-slate-900/80 border border-rose-900/50 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center text-rose-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Nexus Triggered</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2 text-rose-400">{summaryMetrics.exceededStates} States</p>
                <div className="text-[11px] text-rose-400/80 mt-1">Tax registration mandatory</div>
              </div>

              <div className="bg-gradient-to-b from-amber-950/40 to-slate-900/80 border border-amber-900/50 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Near Threshold (&gt;80%)</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2 text-amber-400">{summaryMetrics.warningStates} States</p>
                <div className="text-[11px] text-amber-400/80 mt-1">Monitor next billing cycle</div>
              </div>
            </div>

            {/* Email Report Lead Box */}
            <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                  Official Export
                </span>
                <h3 className="text-xl font-bold text-white">Need a Formal Audit Report for your CPA?</h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Generate a comprehensive PDF audit break-down with timestamped state thresholds.
                </p>
              </div>

              {!isUnlocked ? (
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="business@company.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition whitespace-nowrap"
                  >
                    <Lock className="w-4 h-4" /> Unlock PDF
                  </button>
                </form>
              ) : (
                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition"
                >
                  <Download className="w-4 h-4" /> {isDownloading ? "Generating PDF..." : "Download Official Audit (PDF)"}
                </button>
              )}
            </div>

            {/* Filter Tabs & State Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
              <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">50-State Nexus Breakdown</h3>
                  <p className="text-xs text-slate-400">Tracked against dynamic Wayfair sales & transaction thresholds</p>
                </div>

                {/* Filter buttons */}
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      filter === "all" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All States ({data.length})
                  </button>
                  <button
                    onClick={() => setFilter("action_needed")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      filter === "action_needed" ? "bg-rose-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Action Needed ({summaryMetrics.exceededStates + summaryMetrics.warningStates})
                  </button>
                  <button
                    onClick={() => setFilter("safe")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      filter === "safe" ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Safe
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase text-[11px] tracking-wider">
                      <th className="py-3.5 px-6 font-semibold">State</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                      <th className="py-3.5 px-6 font-semibold">Sales Volume / Limit</th>
                      <th className="py-3.5 px-6 font-semibold">Orders / Limit</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Filing Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredData.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-6 font-medium text-slate-200">
                          {item.state} <span className="text-slate-500 font-mono text-xs">({item.code})</span>
                        </td>
                        <td className="py-4 px-6">
                          {item.status === "exceeded" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <ShieldAlert className="w-3.5 h-3.5" /> Exceeded
                            </span>
                          )}
                          {item.status === "warning" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <AlertTriangle className="w-3.5 h-3.5" /> Near Limit
                            </span>
                          )}
                          {item.status === "safe" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Safe
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-white">${item.totalSales.toLocaleString()}</span>
                              <span className="text-slate-500">
                                {item.revenueThreshold === 0 ? "No Tax" : `$${item.revenueThreshold.toLocaleString()}`}
                              </span>
                            </div>
                            {item.revenueThreshold > 0 && (
                              <div className="w-44 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                                <div
                                  className={`h-full rounded-full ${
                                    item.status === "exceeded"
                                      ? "bg-rose-500"
                                      : item.status === "warning"
                                      ? "bg-amber-400"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${item.revenueProgress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {item.transactionThreshold ? (
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="font-semibold text-white">{item.totalOrders}</span>
                                <span className="text-slate-500">{item.transactionThreshold} orders</span>
                              </div>
                              <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                                <div
                                  className={`h-full rounded-full ${
                                    item.status === "exceeded"
                                      ? "bg-rose-500"
                                      : item.status === "warning"
                                      ? "bg-amber-400"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${item.transactionProgress}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">Revenue Only</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {item.status === "exceeded" ? (
                            <a
                              href="https://www.taxjar.com"
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center justify-end gap-1 ml-auto group"
                            >
                              Register & File{" "}
                              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">Compliant</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
