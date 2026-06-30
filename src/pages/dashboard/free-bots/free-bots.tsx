// @ts-nocheck — uses window.Blockly which is typed loosely; see AGENTS.md
import React from 'react';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import Text from '@/components/shared_ui/text';
import { save_types } from '@/external/bot-skeleton/constants/save-type';
import { load } from '@/external/bot-skeleton';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { DerivLightBotBuilderIcon } from '@deriv/quill-icons/Illustration';
import algorithmic999Xml from '@/xml/algorithmic_999.xml';
import './free-bots.scss';

type TFreeBotConfig = {
    id: string;
    name: string;
    description: string;
    xml: string;
};

const FREE_BOTS: TFreeBotConfig[] = [
    {
        id: 'algorithmic-999',
        name: 'Algorithmic 999',
        description: 'A ready-to-use algorithmic trading bot using a martingale-based staking strategy on Rise/Fall contracts.',
        xml: algorithmic999Xml,
    },
];

const FreeBots = observer(() => {
    const { dashboard } = useStore();
    const { setActiveTab } = dashboard;
    const { isDesktop } = useDevice();
    const [loading_id, setLoadingId] = React.useState<string | null>(null);

    const handleLoadBot = async (bot: TFreeBotConfig) => {
        setLoadingId(bot.id);
        try {
            await load({
                block_string: bot.xml,
                file_name: bot.name,
                workspace: window.Blockly?.derivWorkspace,
                from: save_types.LOCAL,
                drop_event: {},
                strategy_id: null,
                showIncompatibleStrategyDialog: false,
            });
            setActiveTab(DBOT_TABS.BOT_BUILDER);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className='free-bots'>
            <div className='free-bots__header'>
                <Text size={isDesktop ? 's' : 'xs'} weight='bold' color='prominent'>
                    <Localize i18n_default_text='Free bots:' />
                </Text>
            </div>
            <div className='free-bots__list'>
                {FREE_BOTS.map(bot => (
                    <div key={bot.id} className='free-bots__item'>
                        <div className='free-bots__item__icon'>
                            <DerivLightBotBuilderIcon height='24px' width='24px' />
                        </div>
                        <div className='free-bots__item__info'>
                            <Text size={isDesktop ? 'xs' : 'xxs'} weight='bold' color='prominent'>
                                {bot.name}
                            </Text>
                            <Text size='xxs' color='less-prominent' className='free-bots__item__description'>
                                {bot.description}
                            </Text>
                        </div>
                        <div className='free-bots__item__action'>
                            <Button
                                is_loading={loading_id === bot.id}
                                onClick={() => handleLoadBot(bot)}
                                primary
                                small
                            >
                                <Localize i18n_default_text='Load' />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default FreeBots;
