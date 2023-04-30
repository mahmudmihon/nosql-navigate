export interface DbStats {
    db: string,
    avgObjSize: number,
    collections: number,
    dataSize: number,
    fsTotalSize: number,
    fsUsedSize: number,
    indexSize: number,
    indexes: number,
    objects: number,
    ok: number,
    scaleFactor: number,
    storageSize: number,
    totalSize: number,
    views: number
}