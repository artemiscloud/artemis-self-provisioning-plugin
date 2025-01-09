import { render, screen } from '@app/test-utils';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { BrokerRow, BrokerRowProps } from './BrokerRow';
import { BrokerCR } from '@app/k8s/types';
import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  TableData: ({
    id,
    activeColumnIDs,
    children,
  }: {
    id: string;
    activeColumnIDs: Set<string>;
    children: React.ReactNode;
  }) => (
    <td
      data-testid={id}
      data-active={activeColumnIDs.has(id) ? 'true' : 'false'}
    >
      {children}
    </td>
  ),
  Timestamp: ({ timestamp }: { timestamp: string }) => (
    <time>{new Date(timestamp).toLocaleString()}</time>
  ),
}));

const mockColumns: TableColumn<BrokerCR>[] = [
  { title: 'Name', id: 'column1' },
  { title: 'Ready', id: 'column2' },
  { title: 'Status', id: 'column3' },
  { title: 'Size', id: 'column4' },
  { title: 'Creation Timestamp', id: 'column5' },
  { title: 'Actions', id: 'column6' },
];

const mockObj: BrokerCR = {
  metadata: {
    name: 'test-1',
    creationTimestamp: '2024-09-02T07:23:00Z',
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
};

const onEditBroker = jest.fn();
const onOpenModal = jest.fn();

const Props: BrokerRowProps = {
  obj: mockObj,
  rowData: {},
  activeColumnIDs: new Set(mockColumns.map((column) => column.id)),
  columns: mockColumns,
  onEditBroker: onEditBroker,
  onOpenModal: onOpenModal,
};

describe('BrokerRow', () => {
  it('should renders component correctly', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <BrokerRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('test-1')).toBeInTheDocument();
  });

  it('should render broker name with correct href', async () => {
    const comp = render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <BrokerRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    const linkElement = comp.getByText('test-1');
    expect(linkElement.getAttribute('href')).toBe(
      '/k8s/ns/test/brokers/test-1',
    );
  });

  it('should renders the state of the broker as true when broker is ready', async () => {
    const comp = render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <BrokerRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(comp.getByText('True')).toBeInTheDocument();
  });

  it('should renders the status of the broker conditions', async () => {
    const comp = render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <BrokerRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(comp.getByText('1 OK / 1')).toBeInTheDocument();
  });

  it('should render the deployment size of broker as 2', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <BrokerRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render Broker creation timestamp', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <BrokerRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText(/9\/2\/2024, 7:23:00 am/i)).toBeInTheDocument();
  });

  it('should renders kebab toggle for rowActions', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <BrokerRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('button', { name: /kebab toggle/i }),
    ).toBeInTheDocument();
  });
});
