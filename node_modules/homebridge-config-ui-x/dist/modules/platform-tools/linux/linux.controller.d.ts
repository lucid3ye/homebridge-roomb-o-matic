import { LinuxService } from './linux.service';
export declare class LinuxController {
    private readonly linuxServer;
    constructor(linuxServer: LinuxService);
    restartHost(): {
        ok: boolean;
        command: string[];
    };
    shutdownHost(): {
        ok: boolean;
        command: string[];
    };
}
