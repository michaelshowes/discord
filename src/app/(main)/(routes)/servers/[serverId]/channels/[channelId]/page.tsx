import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ChannelType } from '@prisma/client';

import { currentProfile } from '@/lib/currentProfile';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/MediaRoom';
import { db } from '@/lib/db';

type ChannelIdPageProps = {
	params: {
		serverId: string;
		channelId: string;
	};
};

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const channel = await db.channel.findUnique({
		where: {
			id: params.channelId
		}
	});

	const member = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id
		}
	});

	if (!channel || !member) {
		redirect('/');
	}

	return (
		<div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
			<ChatHeader
				name={channel.name}
				serverId={channel.serverId}
				type='channel'
			/>
			{channel.type === ChannelType.TEXT && (
				<>
					<ChatMessages
						member={member}
						name={channel.name}
						chatId={channel.id}
						type='channel'
						apiUrl='/api/messages'
						socketUrl='/api/socket/messages'
						socketQuery={{
							channelId: channel.id,
							serverId: channel.serverId
						}}
						paramKey='channelId'
						paramValue={channel.id}
					/>
					<ChatInput
						name={channel.name}
						type='channel'
						apiUrl='/api/socket/messages'
						query={{
							channelId: channel.id,
							serverId: channel.serverId
						}}
					/>
				</>
			)}
			{channel.type === ChannelType.AUDIO && (
				<MediaRoom
					chatId={channel.id}
					video={false}
					audio={true}
				/>
			)}
			{channel.type === ChannelType.VIDEO && (
				<MediaRoom
					chatId={channel.id}
					video={true}
					audio={true}
				/>
			)}
		</div>
	);
}
