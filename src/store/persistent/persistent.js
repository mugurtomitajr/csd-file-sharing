import {v4 as uuidV4} from 'uuid';

export const kPersistentNodeUid = 'PERSISTENT_NODE_UID';

export const getNodeUid = async () => {
    let nodeUid = await localStorage.getItem(kPersistentNodeUid);
    if(!nodeUid) {
        nodeUid = uuidV4();
        localStorage.setItem(kPersistentNodeUid, nodeUid);
    }
    return nodeUid;
}