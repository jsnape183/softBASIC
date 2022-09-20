const isMatchingType = (expected, actual) =>
  expected === actual || (expected === "Variable" && actual === "Parameter");

export const symbols = () => {
  const table = {};
  let currentScope = "";

  return {
    setScope: (scope) => {
      currentScope = scope;
    },
    clearScope: () => {
      currentScope = "";
    },
    add: (name, type = "Variable", scope = currentScope) => {
      if (
        table[name.toLowerCase()] &&
        (table[name.toLowerCase()].scope === "" ||
          table[name.toLowerCase()].scope === currentScope)
      ) {
        return;
        //throw Error(`${type} ${name} already exists.`);
      }
      table[name.toLowerCase()] = { name, type, scope };
    },
    get: (name, type = "Variable", scope = currentScope) => {
      if (
        table[name.toLowerCase()] &&
        isMatchingType(type, table[name.toLowerCase()].type) &&
        (table[name.toLowerCase()].scope === scope ||
          table[name.toLowerCase()].scope === "")
      ) {
        return table[name.toLowerCase()];
      }

      throw Error(
        `${type} ${name} ${
          scope !== "" ? "in " + scope : ""
        } has not been asigned a value.`
      );
    },
    check: (name, type, scope = currentScope) => {
      return (
        table[name.toLowerCase()] &&
        table[name.toLowerCase()].type === type &&
        (table[name.toLowerCase()].scope === scope ||
          table[name.toLowerCase()].scope === "")
      );
    },
    getAll: (type = "Variable", scope = currentScope) => {
      const result = Object.keys(table).map((s) => {
        if (table[s].type === type && table[s].scope === scope) {
          return { name: s.toLowerCase(), type, scope };
        }
        return null;
      });

      return result.filter((r) => r);
    }
  };
};

export default symbols;
