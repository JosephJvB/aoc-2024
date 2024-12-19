export type Coord = {
  x: number;
  y: number;
};

export const getNeighbours = ({ x, y }: Coord) => {
  return [
    { x: x - 1, y: y - 1 }, // top left
    { x, y: y - 1 }, // top middle
    { x: x + 1, y: y - 1 }, // top right
    { x: x + 1, y }, // middle right
    { x: x + 1, y: y + 1 }, // bottom right
    { x, y: y + 1 }, // bottom middle
    { x: x - 1, y: y + 1 }, // bottom left
    { x: x - 1, y }, // middle left
  ];
};

export const isInBounds = (grid: any[][], { x, y }: Coord) => {
  return y in grid && x in grid[y];
};
