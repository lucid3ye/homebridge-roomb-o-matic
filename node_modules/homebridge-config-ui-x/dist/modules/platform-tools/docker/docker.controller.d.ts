import { DockerService } from './docker.service';
export declare class DockerController {
    private readonly dockerService;
    constructor(dockerService: DockerService);
    getStartupScript(): Promise<{
        script: string;
    }>;
    updateStartupScript(body: any): Promise<{
        script: string;
    }>;
    restartDockerContainer(): Promise<{
        ok: boolean;
        command: string;
    }>;
}
