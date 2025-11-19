interface Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

// Support for WASM file imports
declare module '*.wasm' {
  const content: string;
  export default content;
}

// Support for WASM URL imports
declare module '*.wasm?url' {
  const content: string;
  export default content;
}
