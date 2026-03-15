/** Utility to force waiting for execute code */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
