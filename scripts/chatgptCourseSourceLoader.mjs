// Only extend relative, extensionless imports from the existing web data tree.
export async function resolve(specifier, context, nextResolve) {
  try { return await nextResolve(specifier, context); }
  catch (error) {
    if (error.code !== "ERR_MODULE_NOT_FOUND" ||
        !context.parentURL?.includes("/web/src/") ||
        !/^\.{1,2}\//.test(specifier) || /\.[a-z]+$/i.test(specifier)) throw error;
    return nextResolve(specifier + ".js", context);
  }
}
