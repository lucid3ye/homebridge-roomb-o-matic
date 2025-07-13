declare module "dorita980" {
    export interface Roomba {
        connected: boolean

        on(event: "state", callback: (state: RobotState) => void): void
        on(event: "error", callback: (error: Error) => void): void
        on(event: string, callback: () => void): void
        off(event: string, callback: unknown): void
        clean(): Promise<void>
        cleanRoom(mission: RobotMission): Promise<void>
        resume(): Promise<void>
        pause(): Promise<void>
        stop(): Promise<void>
        end(): void
        dock(): Promise<void>
        find(): Promise<void>
        getRobotState(states: string[]): Promise<RobotState>
    }
    
    export interface RobotState {
        batPct?: number
        bin?: {
            full: boolean
        }
        cleanMissionStatus?: {
            phase: string
            cycle: string
        }
    }

    export interface RobotMission {
        ordered?: number
        pmap_id?: string
        regions?: {
            region_id: string
            type: string
            params?: {
                noAutoPasses?: boolean
                twoPasses?: boolean
            }
        }
        user_pmapv_id?: string
    }

    export class Local implements Roomba {
        public connected: boolean;

        public constructor(blid: string, robotpwd: string, ipaddress: string, version: 2, options?: LocalOptions)
        public constructor(blid: string, robotpwd: string, ipaddress: string, version: 1)
        public constructor(blid: string, robotpwd: string, ipaddress: string)

        public on(event: "state", callback: (state: RobotState) => void): void;
        public on(event: "error", callback: (error: Error) => void): void;
        public on(event: string, callback: () => void): void;
        public off(event: string, callback: unknown): void;
        public clean(): Promise<void>
        public cleanRoom(mission: RobotMission): Promise<void>
        public resume(): Promise<void>
        public pause(): Promise<void>
        public stop(): Promise<void>
        public end(): Promise<void>
        public dock(): Promise<void>
        public find(): Promise<void>
        public getRobotState(states: string[]): Promise<RobotState>
    }

    export interface LocalOptions {
        port?: number
        ciphers?: string
        emitIntervalTime?: number
    }
}
