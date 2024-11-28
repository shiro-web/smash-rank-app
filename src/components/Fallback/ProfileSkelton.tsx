import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkelton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-[50px] w-[50px] rounded-full" />
      <div>
        <Skeleton className="h-[20px] w-[150px] rounded" />
        <Skeleton className="h-[15px] w-[200px] rounded mt-1" />
      </div>
    </div>
  );
}
