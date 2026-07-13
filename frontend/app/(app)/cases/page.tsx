"use client";

import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Select } from "@/app/components/ui/Select";
import StatCard from "@/app/components/ui/StatCard";
import { CaseStats } from "@/app/types";
import { FileText, Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

let options = [
  {
    label: "All Statuses",
    value: ""
  },
  {
    label: "Open",
    value: "none",
  },
  {
    label: "Investigating",
    value: "none",
  },
  {
    label: "Closed",
    value: "none",
  }
];

export default function CasePage() {
  const [cases, setCases] = useState<CaseStats[]>([]);
  const router = useRouter();

  async function fetchCases() {
    const response = await fetch(`http://localhost:3000/cases?status=OPEN`);
    const data = await response.json();
    setCases(data.cases);
  }

  useEffect(() => {
    fetchCases();
  }, []);
  return (
    <div className="mx-10 mt-10 sm:140 md:200 lg:300">
      <h1 className="text-3xl font-bold">Cases</h1>
      <p className="text-[#7C7C7C]">Manage Fraud Investigation Cases</p>

      {/* section 2 ->  */}
      <Card className="mt-15 py-4">
        <div>
          <div className="flex gap-4 mx-auto px-4">
            <Filter />
            Filters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-6 items-center">
            <Input
              icon={<Search color="#737373" size={18} />}
              type="text"
              placeholder="Search alerts..."
            ></Input>

            <Select value={"All Severities"} options={options} />

            <Select value={"All Statuses"} options={options} />
          </div>
        </div>
      </Card>

      {/* section 3 5 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        <StatCard
          className={"text-black"}
          title="Total Cases"
          value={0}
          icon={<FileText className="w-4 h-4" />}
          trend={0}
          trendLabel="this month"
        />
        <StatCard
          className={"text-[#155DFC]"}
          title="Open"
          value={50}
          trend={0}
          trendLabel="vs yesterday"
        />
        <StatCard
          className={"text-[#9810FA]"}
          title="Investigating"
          value={40}
          trend={0}
          trendLabel="this week"
        />
        <StatCard className={"text-[#E80914]"} title="Escalated" value={50} />
        <StatCard className={"text-[#00A63E]"} title="Resolved" value={50} />
      </div>

      {/* section - table */}
      <Card className="mt-10 p-4">
        <h1 className="text-md font-semibold mb-4">All Cases</h1>

        <table className="w-full border-collapse sm:text-xs md:text-md lg:text-lg">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Case ID</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Priority</th>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Notes</th>
              <th className="text-left p-2">Assigned_To</th>
              <th className="text-left p-2">Alerts</th>
            </tr>
          </thead>

          <tbody>
            {cases.map((data) => (
              <tr
                key={data.caseId}
                onClick={() => router.push(`/case/${data.caseId}`)}
                className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="p-2 text-[#767676]">{`case-${data.caseId.slice(0, 8)}`}</td>
                <td>
                  {data.status === "OPEN" ? (
                    <span className="px-4 py-2 bg-[#EFF6FF] text-amber-200 rounded-md">Open</span>
                  ) : data.status === "UNDER_REVIEW" ? (
                    <span className="bg-[#FEF2F2] px-4 py-2 text-amber-200 rounded-md">Escalated</span>
                  ) : (
                    <span className="bg-[#ffffff] text-amber-200 rounded-md">Closed</span>
                  )}
                </td>
                <td
                  className={`p-2 ${
                    data.totalRiskScore < 50
                      ? ""
                      : data.totalRiskScore < 100
                        ? ""
                        : ""
                  }`}
                >
                  {data.totalRiskScore < 50 ? (
                    <span className="bg-[#DBEAFE] text-[#1E40BA] px-4 py-2 flex itemse-center justify-center text-xs rounded-md">
                      Low
                    </span>
                  ) : data.totalRiskScore < 100 ? (
                    <span className="bg-[#FEF9C2] text-[#8A4D02] px-4 py-2 flex itemse-center justify-center text-xs rounded-md">
                      Medium
                    </span>
                  ) : (
                    <span className="bg-[#ECB6B8] text-[#A91D27] px-4 py-2 flex itemse-center justify-center text-xs rounded-md">
                      High
                    </span>
                  )}
                </td>
                <td className="p-2 text-[#767676]">{data.createdAt}</td>
                <td className="p-2">
                  {data.notes.length === 0 ? "Nothing here" : data.notes}
                </td>
                {/* <td className="p-2">{data.alert.length === 0 ? 0 : data.alert.length}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
