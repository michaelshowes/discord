import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/currentProfile';
import ServerSidebar from '@/components/server/ServerSidebar';

export default async function ServerIdLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: {
		serverId: string;
	};
}) {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id
				}
			}
		}
	});

	if (!server) {
		return redirect('/');
	}

	return (
		<div className={'h-full'}>
			<div
				className={'hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed'}
			>
				<ServerSidebar serverId={params.serverId} />
			</div>
			<main className={'h-full md:pl-60'}>{children}</main>
		</div>
	);
}
