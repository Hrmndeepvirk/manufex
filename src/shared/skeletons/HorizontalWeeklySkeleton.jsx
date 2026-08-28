import { Skeleton } from "primereact/skeleton";

export default function HorizontalWeeklySkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {[...Array(7)].map((_, index) => (
        <div key={index} className="c-grid">
          <div className="c-col-12">
            <Skeleton width="100%" height="10rem"></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
}
