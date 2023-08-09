import React, {
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef
} from "react";
import { FixedSizeList } from "react-window";
import { TreeApiContext } from "./context";
import { IdObj, StateContext, TreeProviderProps } from "./types";
import { TreeApi } from "./tree-api";
import { actions, initState, reducer } from "./reducer";
import { useSelectionKey } from "./selection/selection-hook";

const TreeViewProvider = <T extends IdObj>(props: TreeProviderProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initState());
  const list = useRef<FixedSizeList | null>(null);
  const listEl = useRef<HTMLDivElement | null>(null);
  const selectedIds = localStorage.getItem('selectedIds') || '';

  const api = useMemo(
    () => new TreeApi<T>(dispatch, state as StateContext, props, list, listEl),
    [dispatch, state, props, list, listEl]
  );
  const foundIndex = api.state.visibleIds.findIndex((obj) => JSON.parse(selectedIds)[0]==obj);
  
  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dispatch(actions.setVisibleIds(api.visibleIds, api.idToIndex));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dispatch(actions.select(parseInt(foundIndex),false,false));
  }, [dispatch, api.visibleIds, api.idToIndex, props.root,JSON.parse(selectedIds)[0]]);

  useImperativeHandle(props.imperativeHandle, () => api);
  useSelectionKey(listEl, api);

  return (
    <TreeApiContext.Provider value={api}>
      {props.children}
    </TreeApiContext.Provider>
  );
};

export default TreeViewProvider;
