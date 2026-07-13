export function updateMemory(
    oldMemory: any,
    newMemory: any
  ) {
    const memory = { ...oldMemory };
  
    Object.entries(newMemory).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        memory[key] = value;
      }
    });
  
    return memory;
  }