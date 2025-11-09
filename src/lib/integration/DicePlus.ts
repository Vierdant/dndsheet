import OBR from "@owlbear-rodeo/sdk";
import { writable } from 'svelte/store';

const EXTENSION_ID = "dnd5e-sheet";

// reactive store indicating Dice+ availability
export const DICE_PLUS = writable(false);

type DicePlusReadyResponse = {
  requestId: string;      // Matches the request requestId
  ready: true;            // Always true when Dice+ responds
  timestamp: number;      // Response timestamp
}

async function checkDicePlusReady(): Promise<boolean> {
  const requestId = crypto.randomUUID();

  return new Promise((resolve) => {
    const unsubscribe = OBR.broadcast.onMessage("dice-plus/isReady", (event) => {
      const data: DicePlusReadyResponse = event.data as DicePlusReadyResponse;

      // Check if this is a response (not a request)
      if ('ready' in data && data.requestId === requestId) {
        unsubscribe();
        resolve(true);
      }
    });

    // Send ready check request
    OBR.broadcast.sendMessage("dice-plus/isReady", {
      requestId,
      timestamp: Date.now()
    }, { destination: 'ALL' });

    // Timeout after 1 second if no response
    setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, 1000);
  });
}

export async function init(): Promise<boolean> {
  const isDicePlusReady = await checkDicePlusReady();
  if (!isDicePlusReady) {
    console.error("Dice Plus extension not found!");
    // ensure store is false
    DICE_PLUS.set(false);
    return false;
  }

  DICE_PLUS.set(true);
  return true;
}

export async function roll(formula: string): Promise<void> {
    const rollId = `roll_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Send roll request
    await OBR.broadcast.sendMessage("dice-plus/roll-request", {
        rollId,
        playerId: await OBR.player.getId(),
        playerName: await OBR.player.getName(),
        rollTarget: 'everyone',
        diceNotation: formula,
        showResults: true,  // Handle results in your own UI
        timestamp: Date.now(),
        source: EXTENSION_ID  // Use your extension ID
    }, { destination: 'ALL' });

    // Listen for results on YOUR extension's channel
    OBR.broadcast.onMessage(`${EXTENSION_ID}/roll-result`, (event) => {
        const result: any = event.data;
        // Handle your roll result
        if (result && result.rollId === rollId) {
            console.log("Roll complete:", result.result?.totalValue);
        }
    });

    // Listen for errors on YOUR extension's channel
    OBR.broadcast.onMessage(`${EXTENSION_ID}/roll-error`, (event) => {
        const error: any = event.data;
        if (error && error.rollId === rollId) {
            console.error("Roll failed:", error.error);
        }
    });
}

export default {
  init,
  roll,
}