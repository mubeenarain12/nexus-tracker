"use client";

import React, { useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import EmailInterest from "./components/EmailInterest";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { US_NEXUS_RULES, type NexusRule } from "@/data/nexusRules";

type CsvRow = Record<string, string | undefined>;
type Status = "Exceeded" | "Warning" | "Safe" | "No Sales Tax";
type Filter = "All" | "Exceeded" | "Warning" | "Safe";

interface AnalyzedRow extends NexusRule {
  totalSales: number;
  totalOrders: number;
  progress: number;
  status: Status;
}

const FILTERS: Filter[] = ["All", "Exceeded", "Warning", "Safe"];
const STATE_COLS = ["state", "shipping state", "ship state", "state code"];
const AMOUNT_COLS = ["amount", "sales", "total", "order total", "order amount", "subtotal"];
const STATUS_WEIGHT: Record<Status, number> = {
  Exceeded: 0,
  Warning: 1,
  Safe: 2,
  "No Sales Tax": 3,
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("en-US");

const LOOKUP: Record<string, string> = {};
Object.values(US_NEXUS_RULES).forEach((r) => {
  LOOKUP[r.code.toUpperCase()] = r.code;
  LOOKUP[r.state.toUpperCase()] = r.code;
});

function pick(row: CsvRow, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== "") return v;
  }
  return undefined;
}

function parseAmount(value: string | undefined): number {
  if (!value) return 0;
  const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function thresholdLabel(r: NexusRule): string {
  if (r.salesThreshold === 0) return "No sales tax";
  const s = usd.format(r.salesThreshold);
  if (!r.transactionThreshold) return s;
  const t = `${r.transactionThreshold} orders`;
  return r.ruleType === "both" ? `${s} and ${t}` : `${s} or ${t}`;
}

function analyze(rows: CsvRow[]): { results: AnalyzedRow[]; skipped: number } {
  const totals: Record<string, { sales: number; orders: number }> = {};
  let skipped = 0;

  for (const row of rows) {
    const raw = (pick(row, STATE_COLS) ?? "").trim().toUpperCase();
    const code = LOOKUP[raw];
    if (!code) {
      skipped += 1;
      continue;
    }
    if (!totals[code]) totals[code] = { sales: 0, orders: 0 };
    totals[code].sales += parseAmount(pick(row, AMOUNT_COLS));
    totals[code].orders += 1;
  }

  const results = Object.values(US_NEXUS_RULES).map((rule): AnalyzedRow => {
    const t = totals[rule.code] ?? { sales: 0, orders: 0 };
    const salesPct = rule.salesThreshold > 0 ? (t.sales / rule.salesThreshold) * 100 : 0;
    const transPct = rule.transactionThreshold
      ? (t.orders / rule.transactionThreshold) * 100
      : 0;

    let status: Status = "Safe";
    let progress = salesPct;

    if (rule.salesThreshold === 0) {
      status = "No Sales Tax";
      progress = 0;
    } else {
      const salesHit = t.sales >= rule.salesThreshold;
      const transHit = rule.transactionThreshold
        ? t.orders >= rule.transactionThreshold
        : false;

      let exceeded = false;
      let warning = false;

      if (rule.ruleType === "sales_only") {
        exceeded = salesHit;
        warning = !exceeded && salesPct >= 80;
      } else if (rule.ruleType === "either") {
        progress = Math.max(salesPct, transPct);
        exceeded = salesHit || transHit;
        warning = !exceeded && (salesPct >= 80 || transPct >= 80);
      } else {
        progress = Math.min(salesPct, transPct);
        exceeded = salesHit && transHit;
        warning = !exceeded && salesPct >= 80 && transPct >= 80;
      }
      status = exceeded ? "Exceeded" : warning ? "Warning" : "Safe";
    }

    return { ...rule, totalSales: t.sales, totalOrders: t.orders, progress, status };
  });

  results.sort(
    (a, b) =>
      STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status] ||
      b.progress - a.progress ||
      a.state.localeCompare(b.state)
  );

  return { results, skipped };
}

function downloadFile(content: string, name: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Exceeded: "bg-rose-50 text-rose-700 ring-rose-200",
    Warning: "bg-amber-50 text-amber-700 ring-amber-200",
    Safe: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "No Sales Tax": "bg-slate-100 text-slate-600 ring-slate-200",
  };
  const Icon = status === "Exceeded" || status === "Warning" ? AlertTriangle : CheckCircle2;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function ProgressBar({ value, status }: { value: number; status: Status }) {
  const color =
    status === "Exceeded" ? "bg-rose-500" : status === "Warning" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="w-10 text-xs tabular-nums text-slate-500">{Math.round(value)}%</span>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${accent ?? "text-slate-900"}`}>{value}</p>
    </div>
  );
}

export default function Home() {
  const [rows, setRows] = useState<AnalyzedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [skipped, setSkipped] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError("");
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    setLoading(true);
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim().toLowerCase(),
      complete: (res) => {
        const fields = res.meta.fields ?? [];
        const hasState = STATE_COLS.some((c) => fields.includes(c));
        const hasAmount = AMOUNT_COLS.some((c) => fields.includes(c));
        if (!hasState || !hasAmount) {
          setError('We could not find the required columns. Your CSV needs a "State" column and an "Amount" column.');
          setLoading(false);
          return;
        }
        const { results, skipped: s } = analyze(res.data);
        setRows(results);
        setSkipped(s);
        setFileName(file.name);
        setFilter("All");
        setQuery("");
        setLoading(false);
      },
      error: () => {
        setError("We could not read that file. Please check that it is a valid CSV.");
        setLoading(false);
      },
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const stats = useMemo(
    () => ({
      exceeded: rows.filter((r) => r.status === "Exceeded").length,
      warning: rows.filter((r) => r.status === "Warning").length,
      totalSales: rows.reduce((a, r) => a + r.totalSales, 0),
      totalOrders: rows.reduce((a, r) => a + r.totalOrders, 0),
    }),
    [rows]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "All" || r.status === filter) &&
        (q === "" || r.state.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
    );
  }, [rows, filter, query]);

  const exportResults = () => {
    const csv = Papa.unparse(
      rows.map((r) => ({
        State: r.state,
        Code: r.code,
        "Total Sales": r.totalSales.toFixed(2),
        "Total Orders": r.totalOrders,
        Threshold: thresholdLabel(r),
        "Progress %": Math.round(r.progress),
        Status: r.status,
      }))
    );
    downloadFile(csv, "nexus-report.csv");
  };

  const downloadSample = () =>
    downloadFile(
      "order_id,state,amount\n1001,CA,129.99\n1002,TX,89.50\n1003,NY,240.00\n1004,FL,59.99\n1005,CA,310.00\n",
      "sample-sales.csv"
    );

  const reset = () => {
    setRows([]);
    setFileName("");
    setSkipped(0);
    setError("");
  };

  return (
    <div className="min-h-screen">
      <input ref={inputRef} type="file" accept=".csv" onChange={onInputChange} className="hidden" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight">Nexus Tracker</p>
              <p className="text-xs text-slate-500">US sales tax nexus monitoring</p>
            </div>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            Your file is processed in your browser. Nothing is uploaded.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {rows.length === 0 ? (
          <section className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Know where you owe sales tax, before a state tells you.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Upload your sales export and see every state where you are approaching or have crossed
              its economic nexus threshold.
            </p>

            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`mt-10 cursor-pointer rounded-2xl border-2 border-dashed bg-white p-12 transition ${
                dragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
              }`}
            >
              {loading ? (
                <div className="flex flex-col items-center text-slate-600">
                  <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
                  <p className="mt-4 font-medium">Analyzing your sales data...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="h-12 w-12 text-indigo-600" />
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    Drag and drop your sales CSV here
                  </p>
                  <p className="mt-1 text-sm text-slate-500">or click to browse your files</p>
                  <span className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    Choose CSV file
                  </span>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                {error}
              </p>
            )}

            <p className="mt-4 text-sm text-slate-500">
              Required columns: <span className="font-medium text-slate-700">State</span> and{" "}
              <span className="font-medium text-slate-700">Amount</span>. Each row counts as one
              order.{" "}
              <button onClick={downloadSample} className="font-medium text-indigo-600 hover:underline">
                Download a sample CSV
              </button>
            </p>

            <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
              {[
                ["Private by design", "Your data is processed locally in your browser and is never uploaded."],
                ["Clear status at a glance", "Every state is marked Exceeded, Warning, or Safe, most urgent first."],
                ["Export-ready", "Download a clean report to share with your accountant."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Nexus report</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <FileSpreadsheet className="h-4 w-4" />
                  {fileName}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportResults}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Export report
                </button>
                <button
                  onClick={() => {
                    reset();
                    inputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload new file
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="States exceeded" value={String(stats.exceeded)} accent="text-rose-600" />
              <StatCard label="States at warning" value={String(stats.warning)} accent="text-amber-600" />
              <StatCard label="Total sales" value={usd.format(stats.totalSales)} />
              <StatCard label="Total orders" value={num.format(stats.totalOrders)} />
            </div>

            {skipped > 0 && (
              <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-inset ring-amber-200">
                {num.format(skipped)} row{skipped === 1 ? "" : "s"} were skipped because the state
                was missing or not recognized.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      filter === f
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search state"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:w-64"
                />
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">State</th>
                      <th className="px-5 py-3">Total sales</th>
                      <th className="px-5 py-3">Orders</th>
                      <th className="px-5 py-3">Threshold</th>
                      <th className="px-5 py-3">Progress</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                          No states match your filters.
                        </td>
                      </tr>
                    ) : (
                      visible.map((r) => (
                        <tr key={r.code} className="hover:bg-slate-50/70">
                          <td className="px-5 py-3.5 font-medium text-slate-900">
                            {r.state} <span className="text-slate-400">({r.code})</span>
                          </td>
                          <td className="px-5 py-3.5 tabular-nums">{usd.format(r.totalSales)}</td>
                          <td className="px-5 py-3.5 tabular-nums">{num.format(r.totalOrders)}</td>
                          <td className="px-5 py-3.5 text-slate-500">{thresholdLabel(r)}</td>
                          <td className="px-5 py-3.5">
                            {r.status === "No Sales Tax" ? (
                              <span className="text-slate-400">—</span>
                            ) : (
                              <ProgressBar value={r.progress} status={r.status} />
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={r.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <p className="mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Thresholds are provided for general informational purposes and may change. This tool does
          not constitute tax advice. Please confirm requirements with each state&apos;s department of
          revenue or a qualified tax professional.
        </p>
           <EmailInterest />
      </main>
    </div>
  );
}
