import type { IWorkspaceInfo } from '@rocket.chat/core-typings';
import { Box, Card, CardBody, CardCol, CardControls, CardHeader, CardTitle, Icon } from '@rocket.chat/fuselage';
import { useBreakpoints } from '@rocket.chat/fuselage-hooks';
import type { LocationPathname } from '@rocket.chat/ui-contexts';
import { useMediaUrl } from '@rocket.chat/ui-contexts';
import type { ReactElement, ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import VersionCardActionButton from './components/VersionCardActionButton';
import type { VersionActionItem } from './components/VersionCardActionItem';
import VersionCardActionItem from './components/VersionCardActionItem';
import { VersionCardSkeleton } from './components/VersionCardSkeleton';
import { useLicense, useLicenseName } from '../../../../hooks/useLicense';
import { isOverLicenseLimits } from '../../../../lib/utils/isOverLicenseLimits';

type VersionCardProps = {
	serverInfo: IWorkspaceInfo;
};

const VersionCard = ({ serverInfo }: VersionCardProps): ReactElement => {
	const breakpoints = useBreakpoints();
	const isExtraLargeOrBigger = breakpoints.includes('xl');

	const getUrl = useMediaUrl();
	const cardBackground = {
		backgroundImage: `url(${getUrl('images/globe.png')})`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: isExtraLargeOrBigger ? 'right 20px center' : 'left 450px center',
		backgroundSize: 'auto',
	};

	const { t } = useTranslation();

	const { data: licenseData, isPending } = useLicense({ loadValues: true });

	const { limits } = licenseData || {};
	const licenseName = useLicenseName();

	const serverVersion = serverInfo.version;

	const isOverLimits = limits && isOverLicenseLimits(limits);

	const actionButton:
		| undefined
		| {
				path: LocationPathname;
				label: ReactNode;
		  }
		| {
				action: () => void;
				label: ReactNode;
		  } = useMemo(() => {
		// Hide registration and update prompts for enterprise customization
		if (isOverLimits) {
			return { path: '/admin/subscription', label: t('Manage_subscription') };
		}
		return undefined;
	}, [isOverLimits, t]);

	const actionItems = useMemo(() => {
		return (
			[
				// Only show plan limits warning if over limits - hide other registration/version prompts
				isOverLimits && {
					danger: true,
					icon: 'warning',
					label: t('Plan_limits_reached'),
				},
			].filter(Boolean) as VersionActionItem[]
		);
	}, [isOverLimits, t]);

	if (isPending && !licenseData) {
		return (
			<Card style={{ ...cardBackground }}>
				<VersionCardSkeleton />
			</Card>
		);
	}

	return (
		<Card style={{ ...cardBackground }}>
			<CardCol>
				<CardHeader>
					<CardTitle variant='h3'>{t('Version_version', { version: serverVersion })}</CardTitle>
				</CardHeader>

				<Box color='secondary-info'>
					<Icon name='rocketchat' size={16} /> {licenseName.data}
				</Box>
			</CardCol>

			<CardBody flexDirection='column'>
				{actionItems.length > 0 && actionItems.map((item, index) => <VersionCardActionItem key={index} {...item} />)}
			</CardBody>

			{actionButton && (
				<CardControls>
					<VersionCardActionButton {...actionButton} />
				</CardControls>
			)}
		</Card>
	);
};

export default VersionCard;

