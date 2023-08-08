import { StateContext } from "./types";
import { Selection } from "./selection/selection";
import { Cursor } from "./dnd/compute-drop";

export const initState = (): StateContext => ({
  visibleIds: [],
  cursor: { type: "none" } as Cursor,
  editingId: null,
  selection: {
    data: null,
    ids: []
  }
});

function equal(a: Cursor | null, b: Cursor | null) {
  if (a == null || b == null) return false;
  return JSON.stringify(a) == JSON.stringify(b);
}

export const actions = {
  setCursorLocation: (cursor: Cursor) => ({
    type: "SET_CURSOR_LOCATION"  as const,
    cursor
  }),
  setVisibleIds: (
    ids: string[], // index to id
    idMap: { [id: string]: number } // id to index
  ) => ({
    type: "SET_VISIBLE_IDS"  as const,
    ids,
    idMap
  }),
  select: (index: number | null, meta: boolean, shift: boolean) => ({
    type: "SELECT"  as const,
    index,
    meta,
    shift
  }),
  selectId: (id: string) => ({
    type: "SELECT_ID"  as const,
    id
  }),
  edit: (id: string | null) => ({
    type: "EDIT"  as const,
    id
  }),
  stepUp: (shift: boolean, ids: string[]) => ({
    type: "STEP_UP"  as const,
    shift
  }),
  stepDown: (shift: boolean, ids: string[]) => ({
    type: "STEP_DOWN"  as const,
    shift
  })
};

type ActionObj = {
  [Prop in keyof typeof actions]: ReturnType<typeof actions[Prop]>;
};

export type Action = ActionObj[keyof ActionObj];

export function reducer(state: StateContext, action: Action) {
  let s: Selection;
  let focus: number;
  switch (action.type) {
    case "EDIT":
      return {
        ...state,
        editingId: action.id
      };
    case "SET_CURSOR_LOCATION":
      if (equal(state.cursor, action.cursor)) return state;
      return { ...state, cursor: action.cursor };
    case "SELECT":
      s = Selection.parse(state.selection.data, state.visibleIds);
      if (action.index === null) {
        s.clear();
      } else if (action.meta) {
        if (s.contains(action.index)) {
          s.deselect(action.index);
        } else {
          s.multiSelect(action.index);
        }
      } else if (action.shift) {
        s.extend(action.index);
      } else {
        s.select(action.index);
      }
      return {
        ...state,
        selection: {
          data: s.serialize(),
          ids: s.getSelectedItems()
        }
      };
    case "SELECT_ID":
      return {
        ...state,
        selection: {
          ...state.selection,
          ids: [action.id]
        }
      };
    case "STEP_UP":
      s = Selection.parse(state.selection.data, state.visibleIds);
      focus = s.getFocus();
      if (action.shift) {
        s.extend(focus - 1);
      } else {
        s.select(focus - 1);
      }
      return {
        ...state,
        selection: {
          data: s.serialize(),
          ids: s.getSelectedItems()
        }
      };
    case "STEP_DOWN":
      s = Selection.parse(state.selection.data, state.visibleIds);
      focus = s.getFocus();
      if (action.shift) {
        s.extend(focus + 1);
      } else {
        s.select(focus + 1);
      }
      return {
        ...state,
        selection: {
          data: s.serialize(),
          ids: s.getSelectedItems()
        }
      };
    case "SET_VISIBLE_IDS":
      {
      const ids = state.selection.ids;
      s = new Selection([], null, "none", state.visibleIds);
      for (const id of ids) {
        if (id in action.idMap) s.multiSelect(action.idMap[id]);
      }
      return {
        ...state,
        visibleIds: action.ids,
        selection: { ids, data: s.serialize() }
      };
    }
    default:
      return state;
  }
}
