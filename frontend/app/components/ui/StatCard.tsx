import { Card, CardContent, CardHeader, CardTitle } from "./card";

const StatCard = ({
    title,
    value,
    icon,
    trend,
    className
  }: {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
    trendLabel?: string;
    className?: string
  }) => (
    <Card>
      <CardHeader className="flex justify-between mx-4 pb-2">
        <CardTitle className="text-sm font-semibold text-[#737373]">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-2 mx-4">
        <div className={`text-2xl font-bold ${className}`}>{value}</div>
        {trend !== undefined && (
          <div
            className={`text-xs font-medium flex items-center gap-1 ${
              trend > 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
          </div>
        )}
      </CardContent>
    </Card>
  );

export default StatCard