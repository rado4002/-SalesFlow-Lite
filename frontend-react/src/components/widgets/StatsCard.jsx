export default function StatsCard({ icon, label, value, color }) {
  return (
    <div className="p-6 bg-card-bg rounded-2xl shadow-md hover:shadow-xl transition">
      <div className={`text-${color}-500 mb-3`}>{icon}</div>
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}
