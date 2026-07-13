'use client'

import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Select } from "@/app/components/ui/Select";
import StatCard from "@/app/components/ui/StatCard";
import { alertStats } from "@/app/types";
import { FileText, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

let options = [
  {
    label: "All Severities",
    value: "none",
  },
  {
    label: "Critical",
    value: "none",
  },
  {
    label: "Hight",
    value: "none",
  },
  {
    label: "Medium",
    value: "none",
  },
  {
    label: "Low",
    value: "none",
  },
];

export default function AlertPage() {
  const [alerts, setAlerts] = useState<alertStats[]>([]);

  async function fetchAlerts() {
    const response = await fetch(`http://localhost:3000/alerts`);
    const data: { getAlerts: alertStats[] } = await response.json();
    setAlerts(data.getAlerts);
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <div className="mx-10 mt-10 sm:200 md:200 lg:300">
      {/* section 1 -> heading and context */}
      <h1 className="text-3xl font-bold">Alerts</h1>
      <p className="text-[#7C7C7C]">
        Monitor and manage fraud detection alerts in real-time
      </p>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard
          className={'text-black'}
          title="Total Alerts"
          value={0}
          icon={<FileText className="w-4 h-4" />}
          trend={0}
          trendLabel="this month"
        />
        <StatCard
          className={'text-[#E80914]'}
          title="Critical"
          value={50}
          trend={0}
          trendLabel="vs yesterday"
        />
        <StatCard
          className={'text-[#155DFC]'}
          title="Open" 
          value={40} 
          trend={0} 
          trendLabel="this week" 
        />
        <StatCard
          className={'text-[#00A63E]'}
          title="Resolved" 
          value={50}
        />
      </div>

      {/* section - table */}
      <Card className="mt-10 p-4">
        <h1 className="text-md font-semibold mb-4">All Cases</h1>

        <table className="w-full border-collapse sm:text-sm md:text-md lg:text-lg">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 w-25">Alert ID </th>
              <th className="text-left p-2 w">Reasons</th>
              <th className="text-left p-2">Severity</th>
              <th className="text-left p-2">RiskScore</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((data) => (
              <tr key={data.alertId} className="border-b">
                <td className="p-2 text-[#767676]">{`alert-${data.alertId}`}</td>
                <td className="p-2">{data.reasons}</td>
                <td>
                  {data.riskScore < 50
                    ? <span className="px-4 py-3 flex items-center justify-center text-xs rounded-md bg-[#DBEAFE] text-[#1E40BA]">Low</span>
                    : data.riskScore < 100
                      ? <span className="inline-flex translate-x-2 text-xs rounded-md bg-[#FEF9C2] text-[#8A4D02]">Medium</span>
                      : <span className="inline-flex translate-x-2 text-xs rounded-md bg-[#ECB6B8] text-[#A91D27]">High</span>
                  }
                </td>
                <td><span className="bg-red-300 text-amber-100 px-4 py-2 ml-3 rounded-lg flex-1 items-center">{data.riskScore}</span></td>
                <td className="p-2 text-[#767676]">{data.createdAt}</td>
                {/* <td className="p-2">{data.alert.length === 0 ? 0 : data.alert.length}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
