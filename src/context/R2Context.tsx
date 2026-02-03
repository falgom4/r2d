import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { S3Client } from '@aws-sdk/client-s3';
import { useAuth } from './AuthContext';
import { createR2Client } from '@services/r2Client';
import { R2FileOperations } from '@services/fileOperations';
import { MultipartUploader } from '@services/multipartUpload';
import { URLGenerator } from '@services/urlGenerator';

interface R2ContextType {
  client: S3Client | null;
  operations: R2FileOperations | null;
  uploader: MultipartUploader | null;
  urlGenerator: URLGenerator | null;
}

const R2Context = createContext<R2ContextType | undefined>(undefined);

export function R2Provider({ children }: { children: ReactNode }) {
  const { credentials, isAuthenticated } = useAuth();

  const value = useMemo(() => {
    if (!isAuthenticated || !credentials) {
      return {
        client: null,
        operations: null,
        uploader: null,
        urlGenerator: null,
      };
    }

    const client = createR2Client(credentials);
    const operations = new R2FileOperations(client, credentials.bucketName);
    const uploader = new MultipartUploader(client, credentials.bucketName);
    const urlGenerator = new URLGenerator(client, credentials.bucketName);

    return { client, operations, uploader, urlGenerator };
  }, [credentials, isAuthenticated]);

  return <R2Context.Provider value={value}>{children}</R2Context.Provider>;
}

export function useR2() {
  const context = useContext(R2Context);
  if (!context) {
    throw new Error('useR2 debe usarse dentro de R2Provider');
  }
  return context;
}
