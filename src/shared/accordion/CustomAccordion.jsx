import React, { useState, useEffect } from "react";

import { Accordion, AccordionTab } from "primereact/accordion";

export default function CustomAccordion({
  children,
  contentclassname,
  isActive,
  extraClassName,
  title,
  col = 12,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isActive) {
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  }, [isActive]);

  return (
    <Accordion
      onTabChange={(e) => setActiveIndex(e.index)}
      activeIndex={activeIndex}
      col={col}
      contentclassname={contentclassname}
      className={`custom-accordion border-none c-col-12`}
    >
      <AccordionTab header={title} className={extraClassName} col={col}>
        {children}
      </AccordionTab>
    </Accordion>
  );
}
