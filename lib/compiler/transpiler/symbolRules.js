export const symbolRules = (table, scope) => {
  //console.log({ table: table.getAll("Variable", scope), scope });
  const globals =
    table.getAll("Variable", scope).map((s) => `let ${s.name} = null`).join(`;
      `) +
    `;
      `;

  let onTick = "";
  let onKeyDown = "";
  let onPointerDown = "";
  let onPointerMove = "";

  if (scope === "" && !table.check("onupdate", "Function"))
    onTick = `const onupdate = () => {};
    `;
  if (scope === "" && !table.check("onkeydown", "Function"))
    onKeyDown = `const onkeydown = () => {};
    `;

  if (scope === "" && !table.check("onpointerdown", "Function"))
    onPointerDown = `const onpointerdown = () => {};
    `;

  if (scope === "" && !table.check("onpointermove", "Function"))
    onPointerMove = `const onpointermove = () => {};
    `;

  return `${globals}${onTick}${onKeyDown}${onPointerDown}${onPointerMove}`;
};

export default symbolRules;
