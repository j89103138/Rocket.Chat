import { SidebarDivider, SidebarFooter as Footer } from '@rocket.chat/fuselage';
import type { ReactElement } from 'react';

import { SidebarFooterWatermark } from './SidebarFooterWatermark';

const SidebarFooterDefault = (): ReactElement => {
	return (
		<Footer>
			<SidebarDivider />
			<SidebarFooterWatermark />
		</Footer>
	);
};

export default SidebarFooterDefault;
