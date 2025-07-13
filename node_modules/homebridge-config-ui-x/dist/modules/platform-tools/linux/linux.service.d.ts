import { ConfigService } from '../../../core/config/config.service';
import { Logger } from '../../../core/logger/logger.service';
export declare class LinuxService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService, logger: Logger);
    restartHost(): {
        ok: boolean;
        command: string[];
    };
    shutdownHost(): {
        ok: boolean;
        command: string[];
    };
}
