"use client";

import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { AlertTriangle, CheckCircle2, UploadCloud, RefreshCw } from "lucide-react";
import { US_NEXUS_RULES, type NexusRule } from "@/data/nexusRules";

type CsvRow = Record<string, string | undefined>;

type Status = "Exceeded" | "Warning" | "Safe" | "No Sales Tax";

interface AnalyzedRow extends NexusRule {
  totalSales: number;
  totalOrders: number;
  salesProgress: number;
  transProgress: number;
  status: Status;
}

function parseAmount(value: string | undefined): number {
  if (!value) return 0;
  const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function Home() {
  const [data, setData] = useState<AnalyzedRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        analyzeData(results.data);
        setLoading(false);
      },
      error: () => {
        setLoading(false);
        alert("CSV parse karne me error aaya.");
      },
    });
  };

  const analyzeData = (rows: CsvRow[]) => {
    const stateMap: Record<string, { totalSales: number; totalOrders: number }> = {};

    rows.forEach((row) => {
      const state = (row.State ?? row.state ?? row["Shipping State"] ?? "")
        .trim()
        .toUpperCase();
      const amount = parseAmount(row.Amount ?? row.amount ?? row.Sales ?? row.sales);

      if (state) {
        if (!stateMap[state]) {
          stateMap[state] = { totalSales: 0, totalOrders: 0 };
        }
        stateMap[state].totalSales += amount;
        stateMap[state].totalOrders += 1;
      }
    });

    const analyzed: AnalyzedRow[] = Object.values(US_NEXUS_RULES).map((rule) => {
      const userStateData = stateMap[rule.code.toUpperCase()] ??
        stateMap[rule.state.toUpperCase()] ?? { totalSales: 0, totalOrders: 0 };

      const salesProgress =
        rule.salesThreshold > 0 ? (userStateData.totalSales / rule.salesThreshold) * 100 : 0;
      const transProgress = rule.transactionThreshold
        ? (userStateData.totalOrders / rule.transactionThreshold) * 100
        : 0;

      let status: Status = "Safe";

      if (rule.salesThreshold === 0) {
        status = "No Sales Tax";
      } else {
        const salesHit = userStateData.totalSales >= rule.salesThreshold;
        const transHit = rule.transactionThreshold
          ? userStateData.totalOrders >= rule.transactionThreshold
          : false;

        let hasExceeded = false;
        let isWarning = false;

        if (rule.ruleType === "sales_only") {
          hasExceeded = salesHit;
          isWarning = !hasExceeded && salesProgress >= 80;
        } else if (rule.ruleType === "either") {
          hasExceeded = salesHit || transHit;
          isWarning = !hasExceeded && (salesProgress >= 80 || transProgress >= 80);
        } else {
          hasExceeded = salesHit && transHit;
          isWarning = !hasExceeded && salesProgress >= 80 && transProgress >= 80;
        }

        status = hasExceeded ? "Exceeded" : isWarning ? "Warning" : "Safe";
      }

      return {
        ...rule,
        totalSales: userStateData.totalSales,
        totalOrders: userStateData.totalOrders,
        salesProgress: Math.min(Math.round(salesProgress), 100),
        transProgress: Math.min(Math.round(transProgress), 100),
        status,
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
            <p className="text-slate-600">
              CSV upload karke apne sales tax nexus thresholds monitor karein.
            </p>
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
            <h3 className="text-lg font-semibold text-slate-800">
              Abhi tak koi data load nahi hua
            </h3>
            <p className="text-sm mt-1">
              Upar diye gaye button se CSV upload karein jisme State aur Amount columns hon.
            </p>
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
                      <td className="p-4">
                        {item.salesThreshold > 0
                          ? `$${item.salesThreshold.toLocaleString()}`
                          : "—"}
                      </td>
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
                        {item.status === "No Sales Tax" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> No Sales Tax
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
