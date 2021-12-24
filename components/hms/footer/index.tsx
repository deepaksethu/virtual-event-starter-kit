import { selectIsLocalScreenShared, selectLocalPeerRole } from '@100mslive/hms-video-store';
import { useAVToggle, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import {
  VideoOffIcon,
  VideoOnIcon,
  MicOffIcon,
  MicOnIcon,
  ShareScreenIcon,
  // RecordIcon,
  HangUpIcon
} from '@100mslive/react-icons';
import React from 'react';
import s from './index.module.css';
import Settings from './Settings';
import * as Dialog from '@radix-ui/react-dialog';
import router from 'next/router';
import cn from 'classnames';
import ControlButton from '../ControlButton';
import LeaveButton from '../LeaveButton';

const Footer = () => {
  const role = useHMSStore(selectLocalPeerRole);
  const {
    isAllowedToPublish,
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo
  } = useAVToggle();
  const actions = useHMSActions();
  // const leaveRoom = () => actions.leave();
  const startScreenshare = async () => {
    try {
      await actions.setScreenShareEnabled(true);
    } catch (error) {
      console.log('Error: ', error);
    }
  };
  const isLocalScreenShare = useHMSStore(selectIsLocalScreenShared);
  return (
    <div
      className="w-full flex items-center justify-center space-x-5"
      style={{ height: 'calc(var(--header-height) * 1.2)' }}
    >
      {role?.name !== 'viewer' ? (
        <>
          {isAllowedToPublish.audio ? (
            <ControlButton text="Mic" active={isLocalAudioEnabled} onClick={toggleAudio}>
              {isLocalAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
            </ControlButton>
          ) : null}
          {isAllowedToPublish.video ? (
            <ControlButton text="Video" active={isLocalVideoEnabled} onClick={toggleVideo}>
              {isLocalVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
            </ControlButton>
          ) : null}
          {isAllowedToPublish.screen ? (
            <ControlButton
              text="Screen share"
              active={isLocalScreenShare}
              onClick={startScreenshare}
            >
              <ShareScreenIcon />
            </ControlButton>
          ) : null}
          {/* {isAllowedToPublish.screen ? (
            <ControlButton text="Record">
              <RecordIcon />
            </ControlButton>
          ) : null} */}
          {role?.name === 'backstage' || role?.name === 'stage' || role?.name === 'invitee' ? (
            <Settings />
          ) : null}
          <LeaveButton />
        </>
      ) : null}
    </div>
  );
};

export default Footer;
