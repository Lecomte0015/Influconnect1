import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";


const COLORS = ["#4F6095", "#36A2EB", "#F6E6AB", "#4CAF50", "#FF8042"];

const BrandReports = ({ campaignId, type }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/reports/${campaignId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError("Erreur de chargement"));
  }, [campaignId]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="loading">Chargement...</p>;

  const fallbackWeekly = [
    { week: "S1", reach: 0, engagement: 0 },
    { week: "S2", reach: 0, engagement: 0 },
    { week: "S3", reach: 0, engagement: 0 },
  ];

  const fallbackPie = [
    { name: "Aucune donnée", value: 100 }
  ];

  const weeklyData = data.weekly_data || [];
  const pieData = data.category_distribution || [];

  return (
    <div className="brand-reports">
      {type === "line" && (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData.length ? weeklyData : fallbackWeekly}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reach" stroke="#4F6095" />
              <Line type="monotone" dataKey="engagement" stroke="#36A2EB" />
            </LineChart>
          </ResponsiveContainer>
          {!weeklyData.length && <p className="no-data-msg">Aucune donnée disponible</p>}
        </div>
      )}

      {type === "pie" && (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData.length ? pieData : fallbackPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(pieData.length ? pieData : fallbackPie).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {!pieData.length && <p className="no-data-msg">Aucune donnée disponible</p>}
        </div>
      )}
    </div>
  );
};

export default BrandReports;
