import { useState, useCallback } from "react";
import { ChatSession } from "@/types/chat-session";
import { useQuery } from "@tanstack/react-query";

const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function randomUUID(date = Date.now()): string {
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  const time = date;
  const timeChars = [];
  let rem = time;
  for (let i = 9; i >= 0; i--) {
    timeChars[i] = ULID_ALPHABET[rem % 32];
    rem = Math.floor(rem / 32);
  }
  const rand = new Uint8Array(16);
  cryptoObj?.getRandomValues ? cryptoObj.getRandomValues(rand) : rand.fill(0);
  const randChars = Array.from(
    { length: 16 },
    (_, i) => ULID_ALPHABET[rand[i] % 32]
  );
  return timeChars.join("") + randChars.join("");
}

interface UseFindSessionByIdParams {
  sessionId?: string;
  projectId: string;
}

async function fetchSessionById({
  sessionId,
  projectId,
}: UseFindSessionByIdParams): Promise<ChatSession | null> {
  try {
    const response = await fetch(
      `/api/chat/${projectId}/sessions/${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data as ChatSession;
    }
  } catch (error) {
    console.error("Failed to fetch session by id:", error);
  }
  return null;
}

export function useFindSessionById(params: UseFindSessionByIdParams) {
  return useQuery({
    queryKey: ["sessions", params.sessionId, params.projectId],
    queryFn: () => fetchSessionById(params),
    staleTime: 60 * 1000,
    enabled: !!params.sessionId,
    refetchOnWindowFocus: false,
  });
}
