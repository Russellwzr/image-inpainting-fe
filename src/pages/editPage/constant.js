export const DRAW_TYPE = {
  FREE_DRAW: 'free_draw',
  LASSO_DRAW: 'lasso_draw',
  LASSO_DRAG_POINTS: 'lasso_drag_points',
  NORMAL: 'normal',
}

export const MAX_WIDTH = 1024

export const MAX_HEIGHT = 600

export const originSnapShot = [
  { lassos: [], activeIndex: { lassoIndex: -1, pointIndex: -1 }, freeDraw: [], drawType: DRAW_TYPE.NORMAL },
]
