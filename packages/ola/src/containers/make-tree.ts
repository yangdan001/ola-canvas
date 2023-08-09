export function makeTree(string: string, openByDefault: boolean) {
  // eslint-disable-next-line no-debugger
  debugger
  const root = { id: "ROOT", name: "ROOT", isOpen: true };
  let prevNode = root;
  let prevLevel = -1;
  let tag = 1;
  const id = 1;
  string.split("\n").forEach((line) => {
    const name = JSON.parse(line).name.trimStart();
    const level = JSON.parse(line).name.length - name.length;
    const diff = level - prevLevel;
    const node = { tag: (tag++).toString(),id: JSON.parse(line).id.toString(), name, isOpen: openByDefault };
    if (diff === 1) {
      // First child
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.parent = prevNode;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prevNode.children = [node];
    } else {
      // Find the parent and go up
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let parent = prevNode.parent;
      for (let i = diff; i < 0; i++) {
        parent = parent.parent;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.parent = parent;
      parent.children.push(node);
    }
    prevNode = node;
    prevLevel = level;
  });

  return root;
}
