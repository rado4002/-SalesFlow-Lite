import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { day: "Mon", sales: 2400 },
  { day: "Tue", sales: 1398 },
  { day: "Wed", sales: 2800 },
  { day: "Thu", sales: 3908 },
  { day: "Fri", sales: 4800 },
  { day: "Sat", sales: 3490 },
  { day: "Sun", sales: 2000 },
];

export default function Analytics() {
  return (
    <div className="ml-72 p-10">
      <h1 className="text-4xl font-bold mb-8">Analytics</h1>

      <div className="bg-card-bg p-8 rounded-3xl shadow-xl">
        <LineChart width={900} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} />
        </LineChart>
      </div>
    </div>
  );
}
