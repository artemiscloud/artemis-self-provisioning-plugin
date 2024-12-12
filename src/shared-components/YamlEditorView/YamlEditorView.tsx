import { FC, Suspense, useContext, useState } from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertProps,
  AlertVariant,
  Button,
  Hint,
  HintBody,
  Modal,
  ModalVariant,
  useInterval,
} from '@patternfly/react-core';
import { Loading } from '@app/shared-components/Loading/Loading';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
} from '../../reducers/7.12/reducer';
import YAML, { YAMLParseError } from 'yaml';
import './YamlEditorView.css';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from '@app/i18n/i18n';

type YamlEditorViewPropTypes = {
  isAskingPermissionToClose: boolean;
  permissionGranted: () => void;
  permissionDenied: () => void;
};
export const YamlEditorView: FC<YamlEditorViewPropTypes> = ({
  isAskingPermissionToClose,
  permissionGranted: permissionGranted,
  permissionDenied,
}) => {
  const { t } = useTranslation();
  const formState = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [prevIsAskingPermissionToClose, setPrevIsAskingPermissionToClose] =
    useState(isAskingPermissionToClose);
  if (isAskingPermissionToClose !== prevIsAskingPermissionToClose) {
    if (isAskingPermissionToClose) {
      if (formState.yamlHasUnsavedChanges) {
        setIsModalVisible(true);
      } else {
        permissionGranted();
      }
    }
    setPrevIsAskingPermissionToClose(isAskingPermissionToClose);
  }

  const [currentYaml, setCurrentYaml] = useState<string>();
  const [yamlParseError, setYamlParserError] = useState<YAMLParseError>();

  const getUniqueId = () => new Date().getTime();

  const updateModel = (content: string) => {
    try {
      dispatch({
        operation: ArtemisReducerOperations.setModel,
        payload: { model: YAML.parse(content), isSetByUser: true },
      });
      setYamlParserError(undefined);
      addAlert('changes saved', 'success', getUniqueId());
      return true;
    } catch (e) {
      setYamlParserError(e as YAMLParseError);
      return false;
    }
  };

  const stringedFormState = YAML.stringify(formState.cr, null, '  ');
  const [alerts, setAlerts] = useState<Partial<AlertProps>[]>([]);

  const addAlert = (
    title: string,
    variant: AlertProps['variant'],
    key: React.Key,
  ) => {
    setAlerts((prevAlerts) => [...prevAlerts, { title, variant, key }]);
  };

  const removeAlert = (key: React.Key) => {
    const newAlerts = alerts.filter((alert) => alert.key !== key);
    setAlerts(newAlerts);
  };
  const removeLastAlert = () => {
    const newAlerts = alerts.filter(
      (_alert, i, alerts) => i !== alerts.length - 1,
    );
    setAlerts(newAlerts);
  };
  useInterval(removeLastAlert, alerts.length > 0 ? 2000 : null);
  return (
    <>
      {yamlParseError !== undefined && (
        <Alert
          title={yamlParseError.message}
          variant={AlertVariant.danger}
          isInline
          actionClose
          className="pf-u-mt-md pf-u-mx-md"
        />
      )}
      <Modal
        variant={ModalVariant.small}
        title={t('Unsaved changes')}
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        actions={[
          <Button
            key="confirm"
            variant="primary"
            onClick={() => {
              if (updateModel(currentYaml)) {
                permissionGranted();
              } else {
                permissionDenied();
              }
              setIsModalVisible(false);
            }}
          >
            {t('Save and proceed')}
          </Button>,
          <Button
            key="confirm"
            variant="danger"
            onClick={() => {
              setIsModalVisible(false);
              permissionGranted();
            }}
          >
            {t('Discard and proceed')}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => {
              setIsModalVisible(false);
              permissionDenied();
            }}
          >
            {t('Keep editing')}
          </Button>,
        ]}
      >
        {t(
          'The YAML editor contains pending modifications, manual saving is required.',
        )}
      </Modal>
      {formState.yamlHasUnsavedChanges && (
        <Hint>
          <HintBody>
            {t(
              'Any changes in the YAML view has to be manually saved to get taken into consideration.',
            )}
          </HintBody>
        </Hint>
      )}
      <AlertGroup isToast isLiveRegion>
        {alerts.map(({ key, variant, title }) => (
          <Alert
            variant={AlertVariant[variant]}
            title={title}
            actionClose={
              <AlertActionCloseButton
                title={title as string}
                variantLabel={`${variant} alert`}
                onClose={() => removeAlert(key)}
              />
            }
            key={key}
          />
        ))}
      </AlertGroup>
      <Suspense fallback={<Loading />}>
        <ResourceYAMLEditor
          initialResource={YAML.stringify(formState.cr, null, '  ')}
          onSave={updateModel}
          onChange={(newContent: string) => {
            setCurrentYaml(newContent);
            if (stringedFormState !== newContent) {
              dispatch({
                operation: ArtemisReducerOperations.setYamlHasUnsavedChanges,
              });
            }
          }}
        />
      </Suspense>
    </>
  );
};
