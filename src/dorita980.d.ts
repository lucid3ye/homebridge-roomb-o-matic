declare module 'dorita980' {
  export interface Local {
    start(): Promise<void>;
    stop(): Promise<void>;
    dock(): Promise<void>;
    getStatus(): Promise<any>;
  }
  export const Local: {
    new (blid: string, robotpwd: string, ipaddress: string): Local;
  };
}
