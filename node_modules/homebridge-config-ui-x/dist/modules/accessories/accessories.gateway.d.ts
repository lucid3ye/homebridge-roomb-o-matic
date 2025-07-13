import { WsException } from '@nestjs/websockets';
import { AccessoriesService } from './accessories.service';
export declare class AccessoriesGateway {
    private accessoriesService;
    constructor(accessoriesService: AccessoriesService);
    connect(client: any, payload: any): void;
    getAccessoryLayout(client: any, payload: any): Promise<any>;
    saveAccessoryLayout(client: any, payload: any): Promise<Record<string, unknown> | WsException>;
}
