/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { IconButton, Preview, Loading } from '@100mslive/react-ui';
import {
  MicOffIcon,
  MicOnIcon,
  SettingIcon,
  VideoOffIcon,
  VideoOnIcon,
  ArrowRightIcon
} from '@100mslive/react-icons';
import { useHMSActions, useVideoTile } from '@100mslive/react-sdk';
import s from './index.module.css';
import { HMSPeer } from '@100mslive/hms-video-store';
import InfoIcon from '@components/icons/icon-info';
import { useRouter } from 'next/router';
import { usePreview } from './usePreview';
import SettingDialog from '../SettingDialog';
import Avatar from '../Avatar';

export const PreviewScreen: React.FC<{ token: string }> = ({ token }) => {
  const actions = useHMSActions();
  const router = useRouter();
  const name = router.query.name as string;
  const { localPeer, audioEnabled, videoEnabled } = usePreview(token, 'preview');
  // const [name, setName] = React.useState('');
  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    actions.join({
      userName: name || 'David',
      authToken: token,
      settings: {
        isAudioMuted: !audioEnabled,
        isVideoMuted: !videoEnabled
      }
      //initEndpoint: 'https://qa-init.100ms.live/init'
    });
  };
  return (
    <div className={s['preview-container']}>
      {localPeer ? <PreviewVideo name={name} peer={localPeer} /> : <VideoLoader />}
      <div className={s['wrapper']}>
        <div>
          <p className={s['head-text']}>Welcome {name}</p>
          <p className={s['sub-text']}>Preview your video and audio before joining the stage</p>
        </div>
        <form onSubmit={joinRoom}>
          <p className={s['info']}>
            <InfoIcon /> Note: Your mic is {audioEnabled ? 'on' : 'off'} and video is{' '}
            {videoEnabled ? 'on' : 'off'}
          </p>

          <div className={s['btn-wrapper']}>
            <button className={`${s['back-btn']} ${s['btn']}`} onClick={() => router.push('/')}>
              Go back
            </button>
            <button className={s['btn']} type="submit">
              Join Stage <ArrowRightIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PreviewVideo: React.FC<{ peer: HMSPeer; name: string }> = ({ peer, name }) => {
  const actions = useHMSActions();
  const { videoRef, isLocal, isAudioOn, isVideoOn, audioLevel } = useVideoTile(peer);
  return (
    <Preview.VideoRoot css={{ width: '290px', height: '290px' }} audioLevel={audioLevel}>
      {isVideoOn ? (
        <Preview.Video local={isLocal} ref={videoRef} autoPlay muted playsInline />
      ) : (
        <Avatar size="lg" name={name} />
      )}
      <Preview.Controls>
        <IconButton active={isAudioOn} onClick={() => actions.setLocalAudioEnabled(!isAudioOn)}>
          {isAudioOn ? <MicOnIcon /> : <MicOffIcon />}
        </IconButton>
        <IconButton active={isVideoOn} onClick={() => actions.setLocalVideoEnabled(!isVideoOn)}>
          {isVideoOn ? <VideoOnIcon /> : <VideoOffIcon />}
        </IconButton>
      </Preview.Controls>
      <Preview.Setting>
        <SettingDialog>
          <IconButton>
            <SettingIcon />
          </IconButton>
        </SettingDialog>
      </Preview.Setting>
      <Preview.BottomOverlay />
    </Preview.VideoRoot>
  );
};

const VideoLoader = () => (
  <div className={s['video-loader']}>
    <Loading size={90} />
  </div>
);
