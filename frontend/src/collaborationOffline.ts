export type KnowledgeOfflineCollaborationChange = {
  userID: string;
  libraryID: string;
  pageID: string;
  clientID: string;
  updateID: string;
  title: string;
  content: string;
  yjsUpdate: string;
  yjsState: string;
  editedBlockIDs: string[];
  cursorBlockID?: string;
  selectionBlockID?: string;
  createdAt: number;
  updatedAt: number;
};

const databaseName = "domainry-knowledge-collaboration";
const storeName = "pending-page-updates";

export function knowledgeOfflineCollaborationKey(userID: string, libraryID: string, pageID: string) {
  return `${encodeURIComponent(userID)}:${encodeURIComponent(libraryID)}:${encodeURIComponent(pageID)}`;
}

function openOfflineDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("knowledge.offline_database_unavailable"));
    request.onblocked = () => reject(new Error("knowledge.offline_database_blocked"));
  });
}

async function offlineRequest<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>) {
  const database = await openOfflineDatabase();
  if (!database) return undefined;
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      const request = operation(transaction.objectStore(storeName));
      let result: T;
      request.onsuccess = () => { result = request.result; };
      request.onerror = () => reject(request.error || new Error("knowledge.offline_request_failed"));
      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => reject(transaction.error || new Error("knowledge.offline_transaction_aborted"));
      transaction.onerror = () => reject(transaction.error || new Error("knowledge.offline_transaction_failed"));
    });
  } finally {
    database.close();
  }
}

export async function loadKnowledgeOfflineChange(userID: string, libraryID: string, pageID: string) {
  const value = await offlineRequest<KnowledgeOfflineCollaborationChange | undefined>("readonly", store => store.get(knowledgeOfflineCollaborationKey(userID, libraryID, pageID)));
  if (!value || value.userID !== userID || value.libraryID !== libraryID || value.pageID !== pageID || !value.clientID || !value.updateID || !value.yjsUpdate || !value.yjsState || !Number.isFinite(value.createdAt) || !Number.isFinite(value.updatedAt)) return null;
  return value;
}

export async function saveKnowledgeOfflineChange(value: KnowledgeOfflineCollaborationChange) {
  await offlineRequest("readwrite", store => store.put(value, knowledgeOfflineCollaborationKey(value.userID, value.libraryID, value.pageID)));
}

export async function removeKnowledgeOfflineChange(userID: string, libraryID: string, pageID: string) {
  await offlineRequest("readwrite", store => store.delete(knowledgeOfflineCollaborationKey(userID, libraryID, pageID)));
}
