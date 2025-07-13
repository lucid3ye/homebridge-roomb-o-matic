import { StreamableFile } from '@nestjs/common';
import { ConfigService } from '../../../core/config/config.service';
export declare class HomebridgeHueService {
    private configService;
    constructor(configService: ConfigService);
    streamDumpFile(): Promise<StreamableFile>;
}
