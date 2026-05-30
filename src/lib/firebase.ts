import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || undefined); /* CRITICAL: The app will break without this line */
export const auth = getAuth();

// Standard operational types for advanced telemetry matching guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Standard security error formatting to allow AI diagnostic tools to resolve
 * "Missing or insufficient permissions" immediately.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore SECURE Exception raised: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Perform mandatory connection test on system boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'visitors', 'warmup-connection'));
  } catch (error) {
    // Silently capture permission errors as they are expected due to security rules for non-admin visitors
    if (error instanceof Error) {
      if (error.message.includes('the client is offline')) {
        console.warn("RenoLife Analytics - Client is currently offline or unreachable.");
      } else {
        console.log("RenoLife Analytics - Warmup connection initialized (restricted write rules configured).");
      }
    }
  }
}
testConnection();
