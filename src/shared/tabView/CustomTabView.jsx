import { useState, useEffect, useMemo, useCallback } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import styled from "styled-components";
import {
  SlideInLeftAnimation,
  SlideInRightAnimation,
  fadeInAnimation,
} from "../animations/ReactAnimations";
import { useSearchParams } from "react-router-dom";
import { dashToSpace, spaceToDash } from "@utils/common";

const TabContent = styled.div`
  animation: ${({ direction }) =>
      direction === "right"
        ? SlideInRightAnimation
        : direction === "left"
        ? SlideInLeftAnimation
        : fadeInAnimation}
    0.6s both;
`;

export default function CustomTabView({
  name = "tab",
  tabs = [],
  disabledTabIndices = [],
  useIndex = false,
  scrollable = false,
  noPadding = false,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get(name);

  const [activeIndex, setActiveIndex] = useState(0);
  const [tabDirection, setTabDirection] = useState(null);

  const tabTitles = useMemo(() => tabs.map((t) => t.title), [tabs]);

  useEffect(() => {
    if (tabParam) {
      const title = dashToSpace(tabParam);
      const idx = tabTitles.indexOf(title);
      if (idx !== -1 && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    } else {
      setActiveIndex(0);
    }
  }, [tabParam, tabTitles]);

  // Handle tab change
  const handleChange = useCallback(
    ({ index }) => {
      setTabDirection(
        activeIndex === index ? "" : activeIndex < index ? "right" : "left"
      );

      if (useIndex) {
        setActiveIndex(index);
      } else {
        const selectedTab = spaceToDash(tabTitles[index]);
        setSearchParams({ [name]: selectedTab }, { replace: true });
      }
    },
    [activeIndex, name, setSearchParams, tabTitles, useIndex]
  );

  return (
    <div className={`custom-tab-view  ${noPadding ? "no-padding" : ""}`}>
      <TabView
        activeIndex={activeIndex}
        onTabChange={handleChange}
        scrollable={scrollable}
      >
        {tabs.map((tab, i) => (
          <TabPanel
            key={i}
            header={tab.title}
            disabled={disabledTabIndices.includes(i)}
          >
            <div style={{ overflowX: "hidden" }}>
              <TabContent direction={tabDirection}>{tab.content}</TabContent>
            </div>
          </TabPanel>
        ))}
      </TabView>{" "}
    </div>
  );
}
