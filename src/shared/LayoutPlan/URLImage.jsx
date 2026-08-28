import React, { useState } from "react";
import { Group, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

export default function URLImage({ image, onClick, ...props }) {
  const [img] = useImage(image.src);
  const [hovered, setHovered] = useState(false);

  const tooltipText =
    image.isBooked && image.displayName
      ? `Click to unassign ${image.displayName}`
      : null;

  return (
    <Group
      x={image.x}
      y={image.y}
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
      draggable
      opacity={image?.isBooked ? 0.7 : 1}
      onClick={onClick}
      onTap={onClick}
      onMouseEnter={(e) => {
        setHovered(true);
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "pointer";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "default";
      }}
      {...props}
    >
      <Text
        text={image.displayName || image.shortName}
        align="center"
        wrap="word"
        fill="#000000"
        fontSize={14}
        fontStyle={image.isBooked ? "bold" : "normal"}
      />
      <KonvaImage image={img} />
      {hovered && tooltipText && (
        <Text
          text={tooltipText}
          x={img ? img.width / 2 + 8 : 8}
          y={-10}
          fontSize={13}
          fill="#dc3545"
          fontStyle="bold"
          padding={5}
        />
      )}
    </Group>
  );
}
