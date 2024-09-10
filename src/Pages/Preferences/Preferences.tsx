import ToSModal from '@components/TF2/ToS/ToSModal';
import { useModal } from '@context';
import React from 'react';
import {
  Accordion,
  Checkbox,
  ColorSelector,
  Flex,
  Select,
  TextInput,
  TextItem,
} from '@components/General';
import { currentLang, setLanguage, t, translations } from '@i18n';
import {
  defaultSettings,
  getAllSettings,
  setSettingKey,
} from '@api/preferences';

import './Preferences.css';
import { debounce } from '@api/utils';
import { Eye, EyeOff } from 'lucide-react';

const Preferences = () => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [rconRevealed, setRconRevealed] = React.useState(false);
  const [masterbaseKeyRevealed, setMasterbaseKeyRevealed] =
    React.useState(false);
  const [steamApiKeyRevealed, setSteamApiKeyRevealed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { openModal } = useModal();
  const [refresh, setRefresh] = React.useState(0);

  const languageOptions: SelectOption[] = Object.keys(translations).map(
    (language) => ({
      label: language,
      value: language,
    }),
  );

  const friendsApiUsageOptions: SelectOption[] = [
    {
      label: t('PREF_FRIEND_API_USAGE_ALL'),
      value: 'All',
    },
    {
      label: t('PREF_FRIEND_API_USAGE_CHEATERS_ONLY'),
      value: 'CheatersOnly',
    },
    {
      label: t('PREF_FRIEND_API_USAGE_NONE'),
      value: 'None',
    },
  ];

  console.log(settings.internal?.friendsApiUsage);

  React.useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getAllSettings();
      setSettings(settings);
      setLoading(false);
    };

    void fetchSettings();
  }, [refresh]);

  const handleSettingChange = (
    key: string,
    value: unknown,
    type: 'internal' | 'external' = 'external',
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [type]: {
        ...prevSettings[type],
        [key]: value,
      },
    }));

    setSettingKey(key, value, type);
  };

  const handleDebouncedSettingChange = React.useCallback(
    debounce(handleSettingChange, 500),
    [],
  );

  if (loading) {
    return (
      <div className="absolute top-[40%] left-[40%] translate-y-2/4">
        <TextItem className="text-3xl font-bold" fontSize="h1">
          Loading...
        </TextItem>
        <div className="spinner" />
      </div>
    );
  }

  function handleTermsChange(value: boolean) {
    const closeCallback = () => {
      setTimeout(() => {
        setRefresh(refresh + 1);
      }, 500);
    };
    if (value) {
      openModal(<ToSModal isUnsetting={false} />, {
        closeCallback,
      });
    } else {
      openModal(<ToSModal isUnsetting={true} />, {
        closeCallback,
      });
    }
  }

  function handleMasterbaseKeyChange(e: string) {
    // TODO show TOS if they change the masterbase key and (they haven't agreed to the TOS or the tos agreement is out of date)
    handleSettingChange('masterbaseKey', e, 'internal');
  }

  return (
    <>
      <div className="preference-container">
        <TextItem className="page-header text-3xl font-bold my-6" fontSize="h1">
          {t('PREFERENCES')}
        </TextItem>
        <div className="preferences">
          <Accordion title={t('PREF_GENERAL')} className="preference-accordion">
            <Flex className="preference-option">
              <div className="preference-title">{t('LANGUAGE')}</div>
              <Select
                className="preference-select"
                placeholder={currentLang}
                options={languageOptions}
                onChange={(e) => {
                  setLanguage(e.toString());
                  handleSettingChange('language', e);
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_OPEN_IN_APP')}</div>
              <Checkbox
                checked={settings?.external.openInApp}
                onChange={(e) => handleSettingChange('openInApp', e)}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_RAGE_KICK_BOTS')}</div>
              <Checkbox
                checked={settings.internal?.dumbAutokick}
                onChange={(e) =>
                  handleSettingChange('dumbAutokick', e, 'internal')
                }
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">
                {t('CONFIRM_EXTERNAL_LINKS')}
              </div>
              <Checkbox
                checked={settings.external?.confirmExternalLinks ?? true}
                onChange={(e) =>
                  handleSettingChange('confirmExternalLinks', e, 'external')
                }
              />
            </Flex>
          </Accordion>
          <Accordion title={t('PREF_COLORS')} className="preference-accordion">
            <TextItem className="mr-9">{t('PREF_COLORS_PRECEDENCE')}</TextItem>
            <Flex className="preference-option">
              <div className="preference-title">{t('YOU')}</div>
              <ColorSelector
                value={settings.external.colors?.You}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    You: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('CONVICT')}</div>
              <ColorSelector
                value={settings.external.colors?.Convict}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Convict: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('CHEATER')}</div>
              <ColorSelector
                value={settings.external.colors?.Cheater}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Cheater: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('BOT')}</div>
              <ColorSelector
                value={settings.external.colors?.Bot}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Bot: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('SUSPICIOUS')}</div>
              <ColorSelector
                value={settings.external.colors?.Suspicious}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Suspicious: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('TRUSTED')}</div>
              <ColorSelector
                value={settings.external.colors?.Trusted}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Trusted: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('FRIEND')}</div>
              <ColorSelector
                value={settings.external.colors?.Friend}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Friend: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('FRIEND_OF_CHEATER')}</div>
              <ColorSelector
                value={settings.external.colors?.FriendOfCheater}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    FriendOfCheater: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PLAYER')}</div>
              <ColorSelector
                value={settings.external.colors?.Player}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Player: e,
                  });
                }}
              />
            </Flex>
          </Accordion>
          <Accordion title={t('PREF_ADVANCED')}>
            <Flex className="preference-option pref-password">
              <div className="preference-title">
                {t('PREF_STEAM_API_KEY')}{' '}
                <a
                  className="link text-blue-600 hover:underline"
                  href="https://steamcommunity.com/dev"
                >
                  ({t('GET_ONE_HERE')})
                </a>
              </div>
              <TextInput
                type={steamApiKeyRevealed ? 'input' : 'password'}
                defaultValue={settings?.internal.steamApiKey}
                onLeave={(e) =>
                  handleSettingChange('steamApiKey', e, 'internal')
                }
                withIcon
              />
              <div
                className="flex items-center"
                onClick={() => setSteamApiKeyRevealed(!steamApiKeyRevealed)}
              >
                {steamApiKeyRevealed ? (
                  <EyeOff
                    width={24}
                    height={24}
                    className="pref-password-reveal"
                  />
                ) : (
                  <Eye
                    width={24}
                    height={24}
                    className="pref-password-reveal"
                  />
                )}
              </div>
            </Flex>
            <Flex className="preference-option pref-password">
              <div className="preference-title">{t('PREF_RCON_PASSWORD')}</div>
              <TextInput
                type={rconRevealed ? 'input' : 'password'}
                defaultValue={settings?.internal.rconPassword}
                onLeave={(e) =>
                  handleSettingChange('rconPassword', e, 'internal')
                }
                withIcon
              />
              <div
                className="flex items-center"
                onClick={() => setRconRevealed(!rconRevealed)}
              >
                {rconRevealed ? (
                  <EyeOff
                    width={24}
                    height={24}
                    className="pref-password-reveal"
                  />
                ) : (
                  <Eye
                    width={24}
                    height={24}
                    className="pref-password-reveal"
                  />
                )}
              </div>
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_RCON_PORT')}</div>
              <TextInput
                type={'input'}
                defaultValue={settings?.internal.rconPort}
                onLeave={(e) => {
                  try {
                    const port = Number.parseInt(e);
                    handleSettingChange('rconPort', port, 'internal');
                    //eslint-disable-next-line no-empty
                  } catch {}
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">
                {t('PREF_FRIEND_API_USAGE')}
              </div>
              <Select
                className="preference-select"
                placeholder={
                  friendsApiUsageOptions.find((o) => {
                    return o.value === settings.internal?.friendsApiUsage;
                  })?.label ?? 'Select'
                }
                options={friendsApiUsageOptions}
                onChange={(e) => {
                  handleSettingChange('friendsApiUsage', e, 'internal');
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('AGREE_TO_TOS')}</div>
              <Checkbox
                checked={!!settings?.internal.tosAgreementDate}
                onChange={(e) => handleTermsChange(e)}
              />
            </Flex>
            <Flex className="preference-option pref-password">
              <div className="preference-title">
                {t('PREF_MASTERBASE_KEY')}{' '}
                <a
                  className="link text-blue-600 hover:underline"
                  href="https://megaanticheat.com/provision"
                >
                  ({t('GET_ONE_HERE')})
                </a>
              </div>
              <TextInput
                type={masterbaseKeyRevealed ? 'input' : 'password'}
                defaultValue={settings?.internal.masterbaseKey}
                onLeave={(e) => handleMasterbaseKeyChange(e)}
                withIcon
              />
              <div
                className="flex items-center"
                onClick={() => setMasterbaseKeyRevealed(!masterbaseKeyRevealed)}
              >
                {masterbaseKeyRevealed ? (
                  <EyeOff
                    width={24}
                    height={24}
                    className="pref-password-reveal"
                  />
                ) : (
                  <Eye
                    width={24}
                    height={24}
                    className="pref-password-reveal"
                  />
                )}
              </div>
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">
                {t('PREF_MASTERBASE_HOST')}
              </div>
              <TextInput
                type={'input'}
                defaultValue={settings?.internal.masterbaseHost}
                onLeave={(e) =>
                  handleSettingChange('masterbaseHost', e, 'internal')
                }
              />
            </Flex>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default Preferences;
