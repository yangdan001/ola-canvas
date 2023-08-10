import { IPoint,IRect } from '../../../type';
import { noop } from '../../../utils/common';
import { MoveElementsCommand } from '../../commands/move_elements';
import { Editor } from '../../editor';
import { IBaseTool } from '../type';
// import { GraphType } from '../../../type';

// import { ITexture } from '../../../editor/texture';
/**
 * select tool
 *
 * move selected elements
 */
export class SelectMoveTool implements IBaseTool {
  private startPoint: IPoint = { x: -1, y: -1 };
  private startPoints: IPoint[] = [];
  private dragPoint!: IPoint;
  private dx = 0;
  private dy = 0;
  private prevBBoxPos: IPoint = { x: -1, y: -1 };

  unbindEvents = noop;

  constructor(private editor: Editor) {}
  active() {
    const hotkeysManager = this.editor.hostEventManager;
    const moveWhenToggleShift = () => {
      if (this.dragPoint) {
        this.move();
      }
    };
    hotkeysManager.on('shiftToggle', moveWhenToggleShift);
    this.unbindEvents = () => {
      hotkeysManager.off('shiftToggle', moveWhenToggleShift);
    };
  }
  inactive() {
    this.unbindEvents();
  }
  start(e: PointerEvent) {
    this.startPoint = this.editor.getSceneCursorXY(e);
    const selectedElements = this.editor.selectedElements.getItems();
    this.startPoints = selectedElements.map((element) => ({
      x: element.x,
      y: element.y,
    }));
    const bBox = this.editor.selectedElements.getBBox();
    if (!bBox) {
      console.error(
        "selected elements should't be empty when moving, please report us issue",
      );
    } else {
      this.prevBBoxPos = { x: bBox.x, y: bBox.y };
    }

    this.editor.refLine.cacheXYToBbox();
  }
  drag(e: PointerEvent) {
    this.dragPoint = this.editor.getCursorXY(e);
    this.move();
  }
  private move() {
    this.editor.sceneGraph.showOutline = false;
    const { x, y } = this.editor.viewportCoordsToScene(
      this.dragPoint.x,
      this.dragPoint.y,
    );

    let dx = (this.dx = x - this.startPoint.x);
    let dy = (this.dy = y - this.startPoint.y);

    if (this.editor.hostEventManager.isShiftPressing) {
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = 0;
      } else {
        dx = 0;
      }
    }

    // in the moving phase, AABBox's x and y should round to be integer (snap to pixel grid)
    if (this.editor.setting.get('snapToPixelGrid')) {
      // if dx == 0, we thing it is in vertical moving.
      if (dx !== 0)
        dx = Math.round(this.prevBBoxPos.x + dx) - this.prevBBoxPos.x;
      // similarly dy
      if (dy !== 0)
        dy = Math.round(this.prevBBoxPos.y + dy) - this.prevBBoxPos.y;
    }

    const selectedElements = this.editor.selectedElements.getItems();
    const startPoints = this.startPoints;
    for (let i = 0, len = selectedElements.length; i < len; i++) {
      selectedElements[i].x = startPoints[i].x + dx;
      selectedElements[i].y = startPoints[i].y + dy;
    }

    // 参照线处理（目前不处理 “吸附到像素网格的情况” 的特殊情况）

    const { offsetX, offsetY } = this.editor.refLine.updateRefLine();

    for (let i = 0, len = selectedElements.length; i < len; i++) {
      selectedElements[i].x = startPoints[i].x + dx + offsetX;
      selectedElements[i].y = startPoints[i].y + dy + offsetY;
    }

    this.editor.sceneGraph.render();
  }
  isRectangleFullyInside(rect1:IRect, rect2:IRect) {
    return (
      rect1.x >= rect2.x &&
      rect1.y >= rect2.y &&
      rect1.x + rect1.width <= rect2.x + rect2.width &&
      rect1.y + rect1.height <= rect2.y + rect2.height
    );
  }
  
  end(e: PointerEvent, isEnableDrag: boolean) {
    // this.isRectangleFullyInside()
console.log(22)
const graphs = this.editor.sceneGraph.children;
const selectedElements = this.editor.selectedElements.getItems();
// interface GraphObject {
//   width: number;
//   x: number;
//   y: number;
//   height: number;
//   // Other properties if any
// }
// export interface GraphAttrs {
//   type?: GraphType;
//   id?: string;
//   objectName?: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   // 颜色
//   fill?: ITexture[];
//   stroke?: ITexture[];
//   strokeWidth?: number;
//   // transform 相关
//   rotation?: number;
//   parentId?: string;
//   children?: ITexture[];
// }
// const arr:GraphObject[] = []
// const selectedarr:GraphObject[] = []
// graphs.forEach((item)=>{
//   arr.push({
//     width:item.width,
//     x:item.x,
//     y:item.y,
//     height:item.height,
//   })
// })
// selectedElements.forEach((item)=>{
//   selectedarr.push({
//     width:item.width,
//     x:item.x,
//     y:item.y,
//     height:item.height,
//   })
// })
// arr.forEach((item)=>{
//   selectedarr.forEach((selectedItem) => {
//     this.isRectangleFullyInside(selectedItem, item);
//     console.log(this.isRectangleFullyInside(selectedItem, item),item,';;;;;')
// });
// })
console.log(graphs,'graphs888')
    if (selectedElements.length === 0 || !isEnableDrag) {
      // 移动的时候元素被删除了，或者撤销导致为空
      // TODO: 属性复原
      return;
    }
    // eslint-disable-next-line no-debugger
    debugger
    if (this.dx !== 0 || this.dy !== 0) {
      this.editor.commandManager.pushCommand(
        new MoveElementsCommand(
          'Move Elements',
          selectedElements,
          this.dx,
          this.dy,
        ),
      );
    }
  }
  afterEnd() {
    this.editor.sceneGraph.showOutline = true;
    this.editor.refLine.clear();
    this.editor.sceneGraph.render();
  }
}
