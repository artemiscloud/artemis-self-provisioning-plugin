import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  getAcceptor,
  getCertManagerResourceTemplateFromAcceptor,
  getConfigSecret,
} from '@app/reducers/7.12/reducer';
import { CertIssuerModel, CertModel, SecretModel } from '@app/k8s/models';
import { K8sResourceCommonWithData } from '@app/k8s/types';
import {
  k8sCreate,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import * as x509 from '@peculiar/x509';
import {
  Alert,
  Button,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  FormGroup,
  InputGroup,
  Tooltip,
  InputGroupItem,
  Icon,
} from '@patternfly/react-core';
import {
  Select,
  SelectGroup,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import { t } from 'i18next';
import base64 from 'base-64';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { CertificateDetailsModal } from './CertificateDetailsModal/CertificateDetailsModal';
import { PresetAlertPopover } from '../AcceptorsConfigPage/AcceptorConfigSection/AcceptorConfigPage/PresetAlertPopover/PresetAlertPopover';
import { ConfigType } from '../ConfigurationPage';
import { useHasCertManager } from '../../../../../k8s/customHooks';

const secretGroupVersionKind = {
  group: 'core',
  kind: 'Secret',
  version: 'v1',
};

const useCreateSecretOptions = ({
  customOptions,
  certManagerSecrets,
  legacySecrets,
  configType,
  configName,
  isCa,
}: CreateSecretOptionsPropTypes) => {
  const filteredCustomOptions = customOptions.filter(
    (option) =>
      !certManagerSecrets.find((s) => s.metadata.name.startsWith(option)) &&
      !legacySecrets.find((s) => s.metadata.name.startsWith(option)),
  );
  const ptlsSecrets = certManagerSecrets.filter((secret) => {
    return secret.metadata.name.endsWith('-ptls');
  });
  const nonptlsSecrets = certManagerSecrets.filter((secret) => {
    return !secret.metadata.name.endsWith('-ptls');
  });
  return [
    filteredCustomOptions.length > 0 && (
      <SelectGroup
        label={t('Custom secret name"')}
        key={'customOptions' + configType + configName + isCa}
      >
        {filteredCustomOptions.map((secret, index) => (
          <SelectOption key={'cO' + index} value={secret} label={secret} />
        ))}
      </SelectGroup>
    ),
    nonptlsSecrets.length > 0 && (
      <SelectGroup
        label={t('Cert manager certs')}
        key={'cert-manager-certs' + configType + configName + isCa}
      >
        {nonptlsSecrets.map((secret, index) => (
          <SelectOption
            key={'cm' + index}
            value={secret.metadata.name}
            label={secret.metadata.name}
          />
        ))}
      </SelectGroup>
    ),
    legacySecrets.length > 0 && (
      <SelectGroup
        label={t('Legacy certs')}
        key={'legacy-certs' + configType + configName + isCa}
      >
        {legacySecrets.map((secret, index) => (
          <SelectOption
            key={'lg' + index}
            value={secret.metadata.name}
            label={secret.metadata.name}
          />
        ))}
      </SelectGroup>
    ),
    ptlsSecrets.length > 0 && (
      <SelectGroup
        label={t('Reserved -plts secrets')}
        key={'reserved-certs' + configType + configName + isCa}
      >
        {ptlsSecrets.map((secret, index) => (
          <SelectOption
            isDisabled
            key={'cm' + index}
            value={secret.metadata.name}
            label={secret.metadata.name}
          />
        ))}
      </SelectGroup>
    ),
  ];
};

type CreateSecretOptionsPropTypes = {
  customOptions?: string[];
  certManagerSecrets: K8sResourceCommonWithData[];
  legacySecrets: K8sResourceCommonWithData[];
  configType: ConfigType;
  configName: string;
  isCa: boolean;
};
type CertSecretSelectorProps = {
  namespace: string;
  isCa: boolean;
  configType: ConfigType;
  configName: string;
  canSetCustomNames?: boolean;
};

export const CertSecretSelector: FC<CertSecretSelectorProps> = ({
  namespace,
  isCa,
  configType,
  configName,
  canSetCustomNames,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const [secrets, loaded, _loadError] = useK8sWatchResource<
    K8sResourceCommonWithData[]
  >({
    isList: true,
    groupVersionKind: secretGroupVersionKind,
    namespaced: true,
    namespace: namespace,
  });

  const selectedSecret = getConfigSecret(cr, configType, configName, isCa);

  const [isOpen, setIsOpen] = useState(false);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const clearSelection = () => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorSecret,
        payload: {
          secret: undefined,
          name: configName,
          isCa: isCa,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorSecret,
        payload: {
          secret: undefined,
          name: configName,
          isCa: isCa,
        },
      });
    }
    if (configType === ConfigType.console) {
      dispatch({
        operation: ArtemisReducerOperations.setConsoleSecret,
        payload: {
          secret: undefined,
          name: configName,
          isCa: isCa,
        },
      });
    }
    setIsOpen(false);
  };

  const onSelect = (
    _event: React.MouseEvent | React.ChangeEvent,
    value: SelectOptionObject,
    isPlaceholder: boolean,
  ) => {
    if (isPlaceholder) {
      clearSelection();
    } else {
      if (configType === ConfigType.acceptors) {
        dispatch({
          operation: ArtemisReducerOperations.setAcceptorSecret,
          payload: {
            secret: value,
            name: configName,
            isCa: isCa,
          },
        });
      }
      if (configType === ConfigType.connectors) {
        dispatch({
          operation: ArtemisReducerOperations.setConnectorSecret,
          payload: {
            secret: value,
            name: configName,
            isCa: isCa,
          },
        });
      }
      if (configType === ConfigType.console) {
        dispatch({
          operation: ArtemisReducerOperations.setConsoleSecret,
          payload: {
            secret: value,
            name: configName,
            isCa: isCa,
          },
        });
      }
      setIsOpen(false);
    }
  };

  //Cert_annotation_key   = "cert-manager.io/issuer-name"
  //Bundle_annotation_key = "trust.cert-manager.io/hash"
  const isCertSecret = (secret: K8sResourceCommonWithData): boolean => {
    if (!secret.metadata || !secret.metadata.annotations) {
      return false;
    }
    if (isCa) {
      if (
        secret.metadata.annotations &&
        'trust.cert-manager.io/hash' in secret.metadata.annotations
      ) {
        return true;
      }
    } else if (
      secret.metadata.annotations &&
      'cert-manager.io/issuer-name' in secret.metadata.annotations
    ) {
      return true;
    }
    return false;
  };

  const hasKey = (data: any, key: string): boolean => {
    if (data instanceof Object) {
      return key in data;
    }
    return false;
  };

  const isLegacySecret = (secret: K8sResourceCommonWithData): boolean => {
    return (
      !(
        secret.metadata?.annotations &&
        'aa-spp-generated' in secret.metadata.annotations
      ) &&
      hasKey(secret.data, 'broker.ks') &&
      hasKey(secret.data, 'keyStorePassword') &&
      hasKey(secret.data, 'client.ts') &&
      hasKey(secret.data, 'trustStorePassword')
    );
  };

  const parseSecrets = (): {
    certManagerSecrets: K8sResourceCommonWithData[];
    legacySecrets: K8sResourceCommonWithData[];
  } => {
    const certSecrets = secrets.filter((x) => {
      return isCertSecret(x);
    });
    const legacySecrets = secrets.filter((x) => {
      return isLegacySecret(x);
    });
    return { certManagerSecrets: certSecrets, legacySecrets: legacySecrets };
  };

  const { certManagerSecrets, legacySecrets } = useMemo(
    () => parseSecrets(),
    [secrets],
  );

  const [isSecretGenerating, setIsSecretGenerating] = useState<boolean>(false);
  const [certGenMessage, setCertGenMessage] = useState<string>('Generate');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(false);
  const [certGenInfo, setCertGenInfo] = useState<string>('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [caGenFromTlsSecret, setCaGenFromTlsSecret] = useState('');
  const [isCertDetailsModalOpen, setIsCertDetailsModalOpen] = useState(false);
  const [certsToShow, setCertsToShow] = useState<x509.X509Certificate[]>([]);
  const [certsToShowSecret, setCertsToShowSecret] = useState<string>('');
  const [sertsToShowPem, setCertsToShowPem] = useState<string>('');

  const onCloseCertDetailsModel = () => {
    setIsCertDetailsModalOpen(false);
  };

  const [certManagerDeployments] = useK8sWatchResource<
    K8sResourceCommonWithData[]
  >({
    isList: true,
    groupVersionKind: {
      group: 'apps',
      kind: 'Deployment',
      version: 'v1',
    },
    namespaced: true,
    namespace: 'cert-manager',
  });

  const [certIssuers] = useK8sWatchResource<K8sResourceCommonWithData[]>({
    isList: true,
    groupVersionKind: {
      group: 'cert-manager.io',
      kind: 'Issuer',
      version: 'v1',
    },
    namespaced: true,
    namespace: namespace,
  });

  const [certs] = useK8sWatchResource<K8sResourceCommonWithData[]>({
    isList: true,
    groupVersionKind: {
      group: 'cert-manager.io',
      kind: 'Certificate',
      version: 'v1',
    },
    namespaced: true,
    namespace: namespace,
  });

  const onDrawerExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const onCloseDrawer = () => {
    setIsDrawerExpanded(false);
  };

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead key={'drawerHead' + configType + configName + isCa}>
        <span tabIndex={isDrawerExpanded ? 0 : -1} ref={drawerRef}>
          {certGenInfo}
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseDrawer} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );

  const failedSecretGen = (messages: string) => {
    setCertGenInfo(messages);
    setIsDrawerExpanded(true);
    setIsSecretGenerating(false);
    setCertGenMessage('Generate');
  };

  const succeededSecretGen = (message?: string) => {
    setIsSecretGenerating(false);
    setCertGenMessage('Generate');
    setCertGenInfo('cert generation successful \n' + (message ? message : ''));
    setIsDrawerExpanded(true);
  };

  const createSelfSigningIssuer = async (issuerName: string) => {
    if (certIssuers?.length > 0) {
      for (let i = 0; i < certIssuers.length; i++) {
        if (certIssuers[i].metadata.name === issuerName) {
          return true;
        }
      }
    }
    const content = {
      apiVersion: 'cert-manager.io/v1',
      kind: 'Issuer',
      metadata: {
        name: issuerName,
        namespace: namespace,
      },
      spec: {
        selfSigned: {},
      },
    };

    return await k8sCreate({ model: CertIssuerModel, data: content });
  };

  const createSelfSignedCert = async (nameBase: string) => {
    let certName = nameBase;
    let nameValid = false;
    let index = 0;
    while (certs?.length > 0 && !nameValid) {
      nameValid = true;
      for (let i = 0; i < certs.length; i++) {
        if (certs[i].metadata.name === certName) {
          nameValid = false;
          certName = nameBase + '-' + index++;
          break;
        }
      }
    }

    const content = {
      apiVersion: 'cert-manager.io/v1',
      kind: 'Certificate',
      metadata: {
        name: certName,
        namespace: namespace,
      },
      spec: {
        isCA: true,
        commonName: 'arkmq-org.io',
        secretName: certName + '-secret',
        subject: {
          organizations: ['www.arkmq-org.io'],
        },
        issuerRef: {
          name: 'issuer-amq-spp-test',
          kind: 'Issuer',
        },
        dnsNames: ['localhost'],
      },
    };

    return await k8sCreate({ model: CertModel, data: content }).then(() => {
      return { certName: certName, secretName: certName + '-secret' };
    });
  };

  const findSecret = (secName: string): K8sResourceCommonWithData => {
    let result: K8sResourceCommonWithData = null;
    for (let i = 0; i < secrets.length; i++) {
      if (secrets[i].metadata.name === secName) {
        result = secrets[i];
        break;
      }
    }
    return result;
  };

  const generateCaSecret = async () => {
    const tlsSecret = findSecret(caGenFromTlsSecret);
    if (tlsSecret !== null) {
      const caSecName = 'ca-' + caGenFromTlsSecret;
      const caSecret: K8sResourceCommonWithData = {
        apiVersion: 'v1',
        kind: 'Secret',
        metadata: {
          name: caSecName,
          namespace: namespace,
          annotations: {
            //to fake a trust-manager bundle
            'trust.cert-manager.io/hash':
              '401f277bd06c5ea2cbdf910cc7fb61c46965a0418ff8c2627d041cf92aeb0003',
          },
        },
        data: {
          'cabundle.pem': tlsSecret.data['tls.crt'],
        },
      };
      await k8sCreate({ model: SecretModel, data: caSecret })
        .then(() => {
          succeededSecretGen(
            'CA Secret:' +
              caSecName +
              '\nMatching TLS Secret: ' +
              caGenFromTlsSecret,
          );
          setCaGenFromTlsSecret('');
          if (configType === ConfigType.acceptors) {
            dispatch({
              operation: ArtemisReducerOperations.setAcceptorSecret,
              payload: {
                secret: caSecName,
                name: configName,
                isCa: isCa,
              },
            });
          }
          if (configType === ConfigType.connectors) {
            dispatch({
              operation: ArtemisReducerOperations.setConnectorSecret,
              payload: {
                secret: caSecName,
                name: configName,
                isCa: isCa,
              },
            });
          }
          if (configType === ConfigType.console) {
            dispatch({
              operation: ArtemisReducerOperations.setConsoleSecret,
              payload: {
                secret: caSecName,
                name: configName,
                isCa: isCa,
              },
            });
          }
        })
        .catch((err) => {
          failedSecretGen('failed to create ca secret\n' + err.message);
        });
    }
  };

  const { hasCertManager, isLoading: isLoadingCertMgrPresence } =
    useHasCertManager();
  const certMgrFound = hasCertManager && !isLoadingCertMgrPresence;

  const onCreateTestCert = () => {
    setIsSecretGenerating(true);

    setCertGenMessage('Checking cert-manager');
    setCertGenInfo(
      'cert mgr pods: ' + certManagerDeployments.length.toString(),
    );

    if (!certMgrFound) {
      failedSecretGen(
        'No cert-manager found\n' + 'please install cert-manager.',
      );
      return;
    }
    setCertGenMessage('Creating issuer');

    createSelfSigningIssuer('issuer-amq-spp-test')
      .then(() => {
        //Create self-signed cert
        setCertGenMessage('Creating cert');
        createSelfSignedCert('cert-amq-spp-test')
          .then((result) => {
            if (isCa) {
              setCaGenFromTlsSecret(result.secretName);
            } else {
              succeededSecretGen();
            }
          })
          .catch((e) => {
            failedSecretGen(e.message);
          });
      })
      .catch((e) => {
        failedSecretGen(e.message);
      });
  };

  useEffect(() => {
    if (loaded && caGenFromTlsSecret !== '') {
      generateCaSecret();
    }
  }, [caGenFromTlsSecret, secrets, loaded]);

  const [customOptions, setCustomOptions] = useState<string[]>([
    selectedSecret.toString(),
  ]);
  const secretOptions = useCreateSecretOptions({
    customOptions,
    certManagerSecrets,
    legacySecrets,
    configType,
    configName,
    isCa,
  });

  const isSelectCertSecret = (): boolean => {
    const theSecret = certManagerSecrets.filter((value) => {
      return value.metadata.name === selectedSecret.toString();
    });
    return theSecret.length === 1;
  };

  const parseCertsFromPem = (pem: string): x509.X509Certificate[] => {
    const certs: x509.X509Certificate[] = [];
    let certPems = pem.split(
      /-----BEGIN CERTIFICATE-----\n|-----END CERTIFICATE-----\n/g,
    );

    certPems = certPems.filter((value) => {
      return value !== '';
    });

    for (let i = 0; i < certPems.length; i++) {
      const pemStr = certPems[i].replace(/\n/g, '');
      const cert = new x509.X509Certificate(pemStr);
      certs.push(cert);
    }
    return certs;
  };

  const showCertInfo = () => {
    const theSecret = certManagerSecrets.filter((value) => {
      return value.metadata.name === selectedSecret.toString();
    });
    if (theSecret.length !== 1) {
      <Alert
        variant="info"
        title={t('only support tls format secret from cert-manager')}
      />;
    }
    let pem: string;
    try {
      if (isCa) {
        Object.keys(theSecret[0].data).forEach((key) => {
          pem = base64.decode(theSecret[0].data[key]);
        });
      } else {
        pem = base64.decode(theSecret[0].data['tls.crt']);
      }

      setCertsToShow(parseCertsFromPem(pem));
      setCertsToShowSecret(theSecret[0].metadata.name);
      setCertsToShowPem(pem);
      setIsCertDetailsModalOpen(true);
    } catch (err) {
      <Alert variant="danger" title={err.message} />;
    }
  };
  const showCertTooltipRef = useRef<HTMLButtonElement>(null);
  const rt = getCertManagerResourceTemplateFromAcceptor(
    cr,
    getAcceptor(cr, configName),
  );
  const stringSelectedSecret = selectedSecret ? selectedSecret.toString() : '';
  return (
    <FormGroup
      label={isCa ? 'Trust Secrets' : 'Cert Secrets'}
      fieldId={'horizontal-form-secret' + configType + configName + isCa}
      key={(isCa ? 'trust-secrets' : 'cert-secrets') + configType + configName}
      labelIcon={
        <>
          {rt && !isCa && configType === ConfigType.acceptors && (
            <PresetAlertPopover
              configName={configName}
              configType={configType}
              kind="warning"
            />
          )}
        </>
      }
    >
      <CertificateDetailsModal
        isModalOpen={isCertDetailsModalOpen}
        certs={certsToShow}
        secretName={certsToShowSecret}
        pem={sertsToShowPem}
        onCloseModal={onCloseCertDetailsModel}
      ></CertificateDetailsModal>
      <Tooltip
        content={
          <>
            {stringSelectedSecret ? (
              <div>
                {t('Show cert details of')} {stringSelectedSecret}
              </div>
            ) : (
              <div>{t('Select a secret to see its details')}</div>
            )}
          </>
        }
        triggerRef={showCertTooltipRef}
      />
      <Drawer isExpanded={isDrawerExpanded} onExpand={onDrawerExpand}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>
            <InputGroup>
              <InputGroupItem>
                <Select
                  id={'select-secrets' + isCa + configType + configName}
                  key={'key-select-secrets' + isCa + configType + configName}
                  variant={SelectVariant.typeahead}
                  typeAheadAriaLabel="Select a secret"
                  onToggle={(_event, isOpen: boolean) => onToggle(isOpen)}
                  onSelect={onSelect}
                  onClear={clearSelection}
                  selections={selectedSecret}
                  isOpen={isOpen}
                  aria-labelledby={'grouped-typeahead-select-id'}
                  placeholderText="Select a Secret"
                  isGrouped
                  menuAppendTo={() => document.body}
                  isCreatable={canSetCustomNames}
                  createText="override with custom name:"
                  onCreateOption={(v) =>
                    setCustomOptions([...customOptions, v])
                  }
                >
                  {secretOptions}
                </Select>
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  variant="secondary"
                  aria-label="View cert"
                  onClick={showCertInfo}
                  ref={showCertTooltipRef}
                  isDisabled={
                    stringSelectedSecret === '' || !isSelectCertSecret()
                  }
                >
                  <Icon size="sm">
                    <InfoCircleIcon />
                  </Icon>
                </Button>
              </InputGroupItem>
              {certMgrFound ? (
                <Button
                  isDisabled={isSecretGenerating}
                  variant="secondary"
                  onClick={onCreateTestCert}
                  isLoading={isSecretGenerating}
                >
                  {certGenMessage}
                </Button>
              ) : (
                <Tooltip
                  content={t('Generation disabled: Install CertManager')}
                >
                  <Button isAriaDisabled variant="secondary">
                    {certGenMessage}
                  </Button>
                </Tooltip>
              )}
            </InputGroup>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </FormGroup>
  );
};
