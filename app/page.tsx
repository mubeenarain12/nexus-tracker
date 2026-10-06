"use client";

import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { AlertTriangle, CheckCircle2, UploadCloud, RefreshCw } from "lucide-react";

export interface NexusRule {
  state: string;
  code: string;
  salesThreshold: number;
  transactionThreshold: number | null;
  ruleType: "both" | "either" | "sales_only";
  notes?: string;
}

export const US_NEXUS_RULES: Record<string, NexusRule> = {
  AL: { state: "Alabama", code: "AL", salesThreshold: 250000, transactionThreshold: null, ruleType: "sales_only" },
  AK: { state: "Alaska", code: "AK", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  AZ: { state: "Arizona", code: "AZ", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  AR: { state: "Arkansas", code: "AR", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  CA: { state: "California", code: "CA", salesThreshold: 500000, transactionThreshold: null, ruleType: "sales_only" },
  CO: { state: "Colorado", code: "CO", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  CT: { state: "Connecticut", code: "CT", salesThreshold: 100000, transactionThreshold: 200, ruleType: "both" },
  DE: { state: "Delaware", code: "DE", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  FL: { state: "Florida", code: "FL", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  GA: { state: "Georgia", code: "GA", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  HI: { state: "Hawaii", code: "HI", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ID: { state: "Idaho", code: "ID", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  IL: { state: "Illinois", code: "IL", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  IN: { state: "Indiana", code: "IN", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  IA: { state: "Iowa", code: "IA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  KS: { state: "Kansas", code: "KS", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  KY: { state: "Kentucky", code: "KY", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  LA: { state: "Louisiana", code: "LA", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ME: { state: "Maine", code: "ME", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MD: { state: "Maryland", code: "MD", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MA: { state: "Massachusetts", code: "MA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MI: { state: "Michigan", code: "MI", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MN: { state: "Minnesota", code: "MN", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MS: { state: "Mississippi", code: "MS", salesThreshold: 250000, transactionThreshold: null, ruleType: "sales_only" },
  MO: { state: "Missouri", code: "MO", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MT: { state: "Montana", code: "MT", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  NE: { state: "Nebraska", code: "NE", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NV: { state: "Nevada", code: "NV", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NH: { state: "New Hampshire", code: "NH", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  NJ: { state: "New Jersey", code: "NJ", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NM: { state: "New Mexico", code: "NM", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  NY: { state: "New York", code: "NY", salesThreshold: 500000, transactionThreshold: 100, ruleType: "both" },
  NC: { state: "North Carolina", code: "NC", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ND: { state: "North Dakota", code: "ND", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  OH: { state: "Ohio", code: "OH", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  OK: { state: "Oklahoma", code: "OK", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  OR: { state: "Oregon", code: "OR", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  PA: { state: "Pennsylvania", code: "PA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  RI: { state: "Rhode Island", code: "RI", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  SC: { state: "South Carolina", code: "SC", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  SD: { state: "South Dakota", code: "SD", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  TN: { state: "Tennessee", code: "TN", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  TX: { state: "Texas", code: "TX", salesThreshold: 500000, transactionThreshold: null, ruleType: "sales_only" },
  UT: { state: "Utah", code: "UT", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  VT: { state: "Vermont", code: "VT", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  VA: { state: "Virginia", code: "VA", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  WA: { state: "Washington", code: "WA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  WV: { state: "West Virginia", code: "WV", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  WI: { state: "Wisconsin", code: "WI", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  WY: { state: "Wyoming", code: "WY", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" }
};

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        analyzeData(results.data);
        setLoading(false);
      },
      error: () => {
        setLoading(false);
        alert("CSV parse karne me error aaya.");
      },
    });
  };

  const analyzeData = (rows: any[]) => {
    const stateMap: Record<string, { totalSales: number; totalOrders: number }> = {};

    rows.forEach((row: any) => {
      const state = (row.State || row.state || row["Shipping State"] || "").trim().toUpperCase();
      const amount = parseFloat(row.Amount || row.amount || row.Sales || row.sales || "0") || 0;

      if (state) {
        if (!stateMap[state]) {
          stateMap[state] = { totalSales: 0, totalOrders: 0 };
        }
        stateMap[state].totalSales += amount;
        stateMap[state].totalOrders += 1;
      }
    });

    const analyzed = Object.values(US_NEXUS_RULES).map((rule: NexusRule) => {
      const userStateData =
        stateMap[(rule.code || "").toUpperCase()] ||
        stateMap[(rule.state || "").toUpperCase()] || { totalSales: 0, totalOrders: 0 };

      const salesProgress = rule.salesThreshold > 0 ? (userStateData.totalSales / rule.salesThreshold) * 100 : 0;
      const transProgress = rule.transactionThreshold ? (userStateData.totalOrders / rule.transactionThreshold) * 100 : 0;

      let hasExceeded = false;
      let isWarning = false;

      if (rule.ruleType === "sales_only") {
        hasExceeded = userStateData.totalSales >= rule.salesThreshold;
        isWarning = !hasExceeded && salesProgress >= 80;
      } else if (rule.ruleType === "either") {
        hasExceeded =
          userStateData.totalSales >= rule.salesThreshold ||
          (rule.transactionThreshold ? userStateData.totalOrders >= rule.transactionThreshold : false);
        isWarning = !hasExceeded && (salesProgress >= 80 || transProgress >= 80);
      } else if (rule.ruleType === "both") {
        hasExceeded =
          userStateData.totalSales >= rule.salesThreshold &&
          (rule.transactionThreshold ? userStateData.totalOrders >= rule.transactionThreshold : false);
        isWarning = !hasExceeded && (salesProgress >= 80 && transProgress >= 80);
      }

      return {
        ...rule,
        totalSales: userStateData.totalSales,
        totalOrders: userStateData.totalOrders,
        salesProgress: Math.min(Math.round(salesProgress), 100),
        transProgress: Math.min(Math.round(transProgress), 100),
        status: hasExceeded ? "Exceeded" : isWarning ? "Warning" : "Safe",
      };
    });

    setData(analyzed);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">US Sales Tax Nexus Tracker</h1>
            <p className="text-slate-600">CSV upload karke apne sales tax threshold thresholds monitor karein.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow"
            >
              <UploadCloud className="w-5 h-5" />
              Upload Sales CSV
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            CSV process ho rahi hai...
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center text-slate-500 shadow-sm">
            <UploadCloud className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">Abhi tak koi data load nahi hua</h3>
            <p className="text-sm mt-1">Upar diye gaye button se CSV upload karein jisme State aur Amount columns hon.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="p-4">State</th>
                    <th className="p-4">Total Sales</th>
                    <th className="p-4">Threshold</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">
                        {item.state} ({item.code})
                      </td>
                      <td className="p-4">${item.totalSales.toLocaleString()}</td>
                      <td className="p-4">${item.salesThreshold.toLocaleString()}</td>
                      <td className="p-4">{item.totalOrders}</td>
                      <td className="p-4">
                        {item.status === "Exceeded" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3.5 h-3.5" /> Exceeded
                          </span>
                        )}
                        {item.status === "Warning" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            <AlertTriangle className="w-3.5 h-3.5" /> Warning
                          </span>
                        )}
                        {item.status === "Safe" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Safe
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
