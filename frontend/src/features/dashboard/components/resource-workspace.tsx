import { FolderKanban, Newspaper, Plus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ResourceType = "posts" | "categories" | "users";

const resourceConfig = {
  posts: {
    title: "Posts",
    singular: "post",
    description: "Create, assign, review, and publish articles.",
    icon: Newspaper,
  },
  categories: {
    title: "Categories",
    singular: "category",
    description: "Organize content into a clear editorial library.",
    icon: FolderKanban,
  },
  users: {
    title: "Users",
    singular: "user",
    description: "Manage team members and their access levels.",
    icon: Users,
  },
};

interface ResourceWorkspaceProps {
  resource: ResourceType;
}

export function ResourceWorkspace({ resource }: ResourceWorkspaceProps) {
  const config = resourceConfig[resource];
  const Icon = config.icon;

  return (
    <main className="w-full flex-1 px-4 py-6 md:px-8 md:py-8 xl:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-7 bg-blue-600" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                Content management
              </p>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              {config.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{config.description}</p>
          </div>
          <Button disabled className="self-start sm:self-auto">
            <Plus className="size-4" />
            New {config.singular}
          </Button>
        </div>

        <Card className="mt-8 border-0 bg-white py-0 shadow-none ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-xs font-medium text-slate-600">
              All {config.title.toLowerCase()}
            </p>
            <Badge
              variant="outline"
              className="border-blue-100 bg-blue-50 text-[10px] text-blue-700"
            >
              UI foundation ready
            </Badge>
          </div>
          <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              The workspace is ready
            </h2>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
              Data tables, forms, pagination, and API actions will be connected
              in the next CRUD implementation step.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
