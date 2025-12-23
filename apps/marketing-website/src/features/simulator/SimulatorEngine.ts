import scenarios from './ScenarioLibrary.json';

export type SimulationResult = {
    scenarioId: string;
    passed: boolean;
    score: number; // 0-100
    missingAssets: string[];
    logs: string[];
};

// Mock function to simulate DB lookup of user's vault
// In production, this would call Supabase
async function checkUserVault(userId: string, assetKey: string): Promise<boolean> {
    // TODO: Replace with real DB call
    // return await supabase.from('user_checklist_status').select('*')...
    console.log(`Checking vault for ${assetKey}...`);
    return Math.random() > 0.5; // Random pass/fail for now
}

export async function runSimulation(userId: string, scenarioId: string): Promise<SimulationResult> {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
        throw new Error(`Scenario ${scenarioId} not found`);
    }

    const logs: string[] = [];
    const missingAssets: string[] = [];
    let assetsFound = 0;

    logs.push(`Initiating Scenario: ${scenario.name}`);
    logs.push(`Description: ${scenario.description}`);

    for (const asset of scenario.required_assets) {
        const hasAsset = await checkUserVault(userId, asset.key);
        if (hasAsset) {
            assetsFound++;
            logs.push(`[PASS] Found asset: ${asset.label}`);
        } else {
            missingAssets.push(asset.label);
            logs.push(`[FAIL] Missing asset: ${asset.label}`);
        }
    }

    const passed = assetsFound >= scenario.success_threshold;
    const score = Math.round((assetsFound / scenario.required_assets.length) * 100);

    logs.push(`Simulation Complete. Result: ${passed ? 'SURVIVED' : 'CRITICAL FAILURE'}`);

    return {
        scenarioId,
        passed,
        score,
        missingAssets,
        logs
    };
}
