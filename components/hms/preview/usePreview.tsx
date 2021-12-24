import { isBrowser } from '@100mslive/hms-video';
import {
  HMSRoomState,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  selectLocalPeer,
  selectRoomState,
  selectIsAllowedToPublish
} from '@100mslive/hms-video-store';
import { useState, useEffect } from 'react';
import { useHMSActions, useHMSStore } from '@100mslive/react-sdk';

export const usePreview = (authToken: string, userName = 'preview') => {
  const [inProgress, setInProgress] = useState(false);
  const actions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const roomState = useHMSStore(selectRoomState);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoDisplayEnabled);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const disableJoin = inProgress || roomState !== HMSRoomState.Preview;
  useEffect(() => {
    // Call preview only when roomState is in disconnected state
    if (roomState === HMSRoomState.Disconnected) {
      actions.preview({
        userName,
        authToken
        //initEndpoint: 'https://qa-init.100ms.live/init'
      });
    }
    if (isBrowser) {
      window.onunload = () => actions.leave();
    }
  }, [roomState, actions, authToken]);
  return {
    localPeer,
    roomState,
    audioEnabled,
    videoEnabled,
    isAllowedToPublish,
    disableJoin,
    actions,
    setInProgress
  };
};