export const createEnum = (values) => {
  let enumeration = {};
  values.forEach((v, i) => {
    enumeration[v] = i;
  });

  return enumeration;
};

export const createKeyValueEnum = (values) => {
  let enumeration = {};
  values.forEach((v, i) => {
    enumeration[v] = { value: i, name: v };
  });
  return enumeration;
};
