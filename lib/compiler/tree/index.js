export const node = (type, data = null, children = []) => ({
  type,
  data,
  children: !children ? [] : Array.isArray(children) ? children : [children]
});

export default node;
