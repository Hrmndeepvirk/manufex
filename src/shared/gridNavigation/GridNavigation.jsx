import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomAnimation from "../animations/CustomAnimation";

export default function GridNavigation({
  items,
  title,
  backable,
  backText = "Go Back",
}) {
  const navigation = useNavigate();
  return (
    <div className="px-3 py-2">
      {backable && (
        <div
          className="mb-2 flex cursor-pointer w-2"
          onClick={() => navigation(-1)}
        >
          <span className="pi pi-angle-left text-xl my-auto" />
          <h3>{backText}</h3>
        </div>
      )}
      {title && <div className="mb-2">{title}</div>}

      <div className="grid">
        {items.map((box, i) => {
          return (
            <div key={i} className="col-12 md:col-6 lg:col-3 xl:col-3">
              <CustomAnimation index={i} className="p-1">
                <div
                  className={`${box?.bgColor} p-3 shadow-2 border-round-2xl transition-all transition-duration-300 hover:shadow-4 hover:-translate-y-1 hover:opacity-95`}
                >
                  <Link to={box.link} style={{ textDecoration: "none" }}>
                    {/* Inner content styled */}
                    <div className="flex align-items-center justify-content-between text-center gap-3">
                      <div className="flex flex-column justify-content-between h-6rem text-left">
                        <div className="text-sm text-secondary no-underline">
                          {box.description}
                        </div>
                        <div className="text-base font-medium text-color-primary no-underline">
                          {box.title}
                        </div>
                      </div>
                      <div className="flex flex-column justify-content-end h-6rem">
                        <img
                          src={box.img}
                          alt={box.title}
                          className="w-3rem h-3rem object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </CustomAnimation>
            </div>
          );
        })}
      </div>
    </div>
  );
}
