export default function GraphCard({ title, children }) {
  return (
    <div className="col-12 lg:col-6">
      <div
        className="shadow-2 border-round-2xl p-4 bg-card h-full flex flex-column transition-all transition-duration-300 
              hover:shadow-4 hover:-translate-y-1 hover:opacity-95"
      >
        <div className="mb-3 text-left text-lg font-semibold text-color-primary">
          {title}
        </div>
        <div className="md:block flex justify-content-center">{children}</div>
      </div>
    </div>
  );
}
