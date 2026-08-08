import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStat } from "../types/dashboard";

interface AdminStatsProps {
  stats: DashboardStat[];
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <main className="container mx-auto w-full flex-1 px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of content and users in Mini CMS.
        </p>
      </div>

      {stats.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Dashboard data has not been connected yet.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
