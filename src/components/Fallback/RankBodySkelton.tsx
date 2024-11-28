import { Skeleton } from "@/components/ui/skeleton";

export function RankBodySkelton() {
  return (
    <tbody>
      {/* 各行にスケルトンを表示 */}
      {Array.from({ length: 50 }).map((_, index) => (
        <tr key={index}>
          {/* 順位のスケルトン */}
          <td>
            <Skeleton className="h-[20px] w-[30px] rounded" />
          </td>
          {/* ユーザーアイコンと名前のスケルトン */}
          <td>
            <div className="flex items-center space-x-2 mt-2">
              <Skeleton className="h-[40px] w-[40px] rounded-full" />
            </div>
          </td>
          {/* 世界戦闘力のスケルトン */}
          <td>
            <Skeleton className="h-[20px] w-[120px] rounded" />
          </td>
          {/* 日付のスケルトン */}
          <td>
            <Skeleton className="h-[20px] w-[80px] rounded" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
