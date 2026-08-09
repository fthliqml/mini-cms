import { RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PostStatus } from "../../types/post";

export type AuthorPostStatusFilter = "all" | PostStatus;

interface AuthorPostToolbarProps {
  search: string;
  status: AuthorPostStatusFilter;
  isRefreshing: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: AuthorPostStatusFilter) => void;
  onRefresh: () => void;
}

const statusLabels: Record<AuthorPostStatusFilter, string> = {
  all: "All posts",
  draft: "Drafts",
  published: "Published",
};

export function AuthorPostToolbar({
  search,
  status,
  isRefreshing,
  onSearchChange,
  onStatusChange,
  onRefresh,
}: AuthorPostToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-900/8 pb-6 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search your posts"
          aria-label="Search your posts"
          className="h-10 rounded-none border-0 border-b border-slate-300 bg-transparent pl-7 shadow-none focus-visible:border-blue-600 focus-visible:ring-0 md:max-w-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as AuthorPostStatusFilter)
          }
        >
          <SelectTrigger className="h-9 min-w-36 bg-white">
            <SelectValue>{statusLabels[status]}</SelectValue>
          </SelectTrigger>
          <SelectContent side="bottom" align="end">
            <SelectItem value="all">All posts</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh posts"
          className="bg-white"
        >
          <RefreshCw
            className={isRefreshing ? "size-4 animate-spin" : "size-4"}
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
