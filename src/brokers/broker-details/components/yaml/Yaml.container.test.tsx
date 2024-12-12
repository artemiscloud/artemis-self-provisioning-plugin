import { fireEvent, render, screen } from '@app/test-utils';
import { YamlContainer } from './Yaml.container';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  ResourceYAMLEditor: jest.fn(() => <div>Mocked ResourceYAMLEditor</div>),
}));

jest.mock('react-router-dom-v5-compat', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

const mockUseParams = useParams as jest.Mock;
const mockUseNavigate = useNavigate as jest.Mock;

describe('YamlContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({
      ns: 'test-namespace',
      name: 'test-1',
    });

    mockUseNavigate.mockReturnValue(jest.fn());
  });

  const mockBrokerCr = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      creationTimestamp: '2024-12-05T07:41:45Z',
      name: 'ex-aao',
      namespace: 'default',
    },
    spec: {
      adminPassword: 'admin',
      adminUser: 'admin',
      console: { expose: true },
      deploymentPlan: {
        image: 'placeholder',
        requireLogin: false,
        size: 2,
      },
    },
  };

  it('should render the YamlContainer component successfully', () => {
    render(<YamlContainer brokerCr={mockBrokerCr} />);
    expect(
      screen.getByText('This YAML view is in read-only mode.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/proceed to the to apply changes/i),
    ).toBeInTheDocument();
  });

  it('should navigate to the edit-broker page with the correct returnUrl when the button is clicked', () => {
    const navigate = jest.fn();
    mockUseNavigate.mockReturnValue(navigate);

    render(<YamlContainer brokerCr={mockBrokerCr} />);

    fireEvent.click(screen.getByRole('button', { name: /edit form/i }));

    expect(navigate).toHaveBeenCalledWith(
      `/k8s/ns/test-namespace/edit-broker/test-1?returnUrl=${encodeURIComponent(
        window.location.pathname,
      )}`,
    );
  });
});
