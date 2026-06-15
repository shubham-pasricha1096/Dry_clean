interface DashboardCardProps {
  title: string;
  value: number;
  color: string;
}

export default function DashboardCard({ title, value, color }: DashboardCardProps) {
  return (
    <div className={`p-6 rounded-lg shadow-md ${color}`}>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
