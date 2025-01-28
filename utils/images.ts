export const DEVICE_SIZES = {
  mobile: 360,
  phablet: 430,
  tablet: 600,
  laptop: 1024,
  desktop: 1350,
  ultrawide: 1660,
}

export const widthTimesAspectRatio = (aspectRatio: string | number, width: number): number => {
  const aspectNum = typeof aspectRatio === 'number' ? aspectRatio : (aspectRatio.split(/[:\/]/).map(Number).reduce((a, b) => a / b));
  return Math.round(width * aspectNum);
}