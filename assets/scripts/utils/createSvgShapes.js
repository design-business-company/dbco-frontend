function createSpiralPath(centerX, centerY, turns, maxRadius) {
  let pathData = `M ${centerX} ${centerY}`; // Start at the center
  const points = 320; // Number of points in the spiral
  const angleIncrement = (2 * Math.PI * turns) / points;

  for (let i = 0; i <= points; i++) {
    const angle = i * angleIncrement;
    const radius = (maxRadius * i) / points;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    pathData += ` L ${x} ${y}`;
  }
  return pathData;
}

function createPolygonPath(centerX, centerY, sides, radius, clockwise = true) {
  if (sides < 3) throw new Error("Polygon must have at least 3 sides");

  let pathData = "";
  const angleIncrement = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = clockwise
      ? i * angleIncrement
      : (sides - i - 1) * angleIncrement; // Reverse for counterclockwise
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    pathData += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  pathData += " Z"; // Close the polygon
  return pathData;
}

function createSineWavePath(startX, startY, amplitude, wavelength, width) {
  let pathData = `M ${startX} ${startY}`; // Start at the initial point
  const segments = 64;
  const segmentWidth = width / segments;

  for (let i = 1; i <= segments; i++) {
    const x = startX + i * segmentWidth;
    const y = startY + amplitude * Math.sin((2 * Math.PI * i) / wavelength);

    // Control point is halfway between the current and previous point
    const controlX = startX + (i - 0.5) * segmentWidth;
    const controlY =
      startY + amplitude * Math.sin((2 * Math.PI * (i - 0.5)) / wavelength);

    // Use quadratic Bézier curve (Q) for smooth transition
    pathData += ` Q ${controlX} ${controlY} ${x} ${y}`;
  }

  return pathData;
}

function createCirclePath(centerX, centerY, radius) {
  const pathData = `
    M ${centerX + radius}, ${centerY}
    A ${radius},${radius} 0 1,0 ${centerX - radius},${centerY}
    A ${radius},${radius} 0 1,0 ${centerX + radius},${centerY}
  `;
  return pathData.trim();
}

export {
  createSpiralPath,
  createPolygonPath,
  createSineWavePath,
  createCirclePath,
};
