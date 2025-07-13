import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
export declare class WsAdminGuard implements CanActivate {
    private configService;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
