import { ConfigService } from '../../../core/config/config.service';
import { Logger } from '../../../core/logger/logger.service';
export declare class DockerService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService, logger: Logger);
    getStartupScript(): Promise<{
        script: string;
    }>;
    updateStartupScript(script: string): Promise<{
        script: string;
    }>;
    restartDockerContainer(): Promise<{
        ok: boolean;
        command: string;
    }>;
}
