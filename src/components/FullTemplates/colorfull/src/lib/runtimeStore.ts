// Simple in-memory runtime store to feed the template without reading JSON files
export type RuntimeBundle = {
  homepage?: any;
  pages?: any[];
  projects?: any[];
  blogPosts?: any[];
  settings?: any;
};

const runtime: RuntimeBundle = {};

export function setRuntimeData(partial: RuntimeBundle) {
  Object.assign(runtime, partial);
}

export function getRuntimeData(): RuntimeBundle {
  return runtime;
}


