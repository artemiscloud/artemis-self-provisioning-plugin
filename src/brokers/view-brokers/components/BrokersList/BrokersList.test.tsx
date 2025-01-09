import { render, screen } from '@app/test-utils';
import { BrokersList, BrokersListProps } from './BrokersList';
import { useListPageFilter } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  ListPageHeader: jest.fn(({ title }) => <div>{title}</div>),
  ListPageCreateLink: jest.fn(({ to, children }) => (
    <a href={to}>{children}</a>
  )),
  ListPageBody: jest.fn(({ children }) => <div>{children}</div>),
  ListPageFilter: jest.fn(() => <div>ListPageFilter</div>),
  VirtualizedTable: jest.fn(({ Row, data, columns }) => (
    <div>
      <div>VirtualizedTable</div>
      {data.map((item: any, index: number) => (
        <Row
          key={index}
          obj={item}
          activeColumnIDs={columns.map((col: any) => col.id)}
        />
      ))}
    </div>
  )),
  useListPageFilter: jest.fn(),
}));

jest.mock('./BrokerRow', () => ({
  BrokerRow: jest.fn(() => <div>BrokerRow Component</div>),
}));

describe('BrokersList', () => {
  const onEditBroker = jest.fn();
  const onOpenModal = jest.fn();

  const mockBrokersListProps: BrokersListProps = {
    brokers: [
      {
        metadata: {
          name: 'test-1',
          creationTimestamp: '2024-09-02T07:25:00Z',
          namespace: 'test',
        },
        spec: {
          deploymentPlan: {
            image:
              'quay.io/arkmq-org/activemq-artemis-self-provisioning-plugin:latest',
            requireLogin: true,
            size: 2,
          },
        },
        status: {
          conditions: [
            {
              type: 'Ready',
              status: 'True',
            },
          ],
        },
      },
      {
        metadata: {
          name: 'test-2',
          creationTimestamp: '2024-09-02T07:25:00Z',
          namespace: 'test',
        },
        spec: {
          deploymentPlan: {
            image:
              'quay.io/arkmq-org/activemq-artemis-self-provisioning-plugin:latest',
            requireLogin: true,
            size: 2,
          },
        },
        status: {
          conditions: [
            {
              type: 'Ready',
              status: 'True',
            },
          ],
        },
      },
    ],
    loaded: true,
    loadError: null,
    namespace: 'test',
    onOpenModal: onOpenModal,
    onEditBroker: onEditBroker,
  };

  beforeEach(() => {
    (useListPageFilter as jest.Mock).mockReturnValue([
      mockBrokersListProps.brokers,
      mockBrokersListProps.brokers,
      jest.fn(),
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the BrokersList component correctly', () => {
    render(<BrokersList {...mockBrokersListProps} />);
    expect(screen.getByText('Brokers')).toBeInTheDocument();
  });

  it('should render the ListPageFilter', () => {
    render(<BrokersList {...mockBrokersListProps} />);
    expect(screen.getByText('ListPageFilter')).toBeInTheDocument();
  });

  it('should render the VirtualizedTable', () => {
    render(<BrokersList {...mockBrokersListProps} />);
    expect(screen.getByText('VirtualizedTable')).toBeInTheDocument();
  });

  it('should render BrokerRow component within the VirtualizedTable', () => {
    render(<BrokersList {...mockBrokersListProps} />);

    const BrokerRowElements = screen.getAllByText('BrokerRow Component');
    expect(BrokerRowElements.length).toBe(mockBrokersListProps.brokers.length);
  });
});
